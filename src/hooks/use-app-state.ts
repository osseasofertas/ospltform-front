import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppUser, AppProduct, AppEvaluation, AppContent } from "../types";

interface UserStats {
  totalEvaluations: number;
  todayEvaluations: number;
  totalEarned: string;
  lastEvaluationDate: string;
}

interface DailyEvaluationStats {
  date: string;
  evaluationsCount: number;
  earnings: string;
  contentEvaluated: Array<{
    contentId: number;
    type: "photo" | "video";
    earning: string;
    completedAt: string;
  }>;
}

interface AppState {
  user: AppUser | null;
  currentProduct: AppProduct | null;
  currentContent: AppContent | null;
  currentEvaluation: AppEvaluation | null;
  userStats: UserStats;
  transactions: Array<{
    id: string;
    type: string;
    amount: string;
    description: string;
    date: string;
  }>;
  completedEvaluations: Array<{
    contentId: number;
    type: "photo" | "video";
    completedAt: string;
    earning: string;
  }>;
  dailyStats: DailyEvaluationStats[];
  globalLogoutDate: string | null; // Global logout date for all future logins
  userLoginDate: string | null; // User's first login date for content rotation

  // Actions
  setUser: (user: AppUser | null) => void;
  setCurrentProduct: (product: AppProduct | null) => void;
  setCurrentContent: (content: AppContent | null) => void;
  setCurrentEvaluation: (evaluation: AppEvaluation | null) => void;
  updateBalance: (amount: string) => void;
  addTransaction: (transaction: {
    type: string;
    amount: string;
    description: string;
  }) => void;
  completeEvaluation: (
    contentId: number,
    contentType: "photo" | "video",
    earning: string
  ) => void;
  incrementDailyEvaluations: () => void;
  resetDailyEvaluationsIfNeeded: () => void;
  logout: () => void;
  isLoginBlocked: () => boolean;
  getDaysUntilLoginAllowed: () => number;
  setPaypalAccount: (paypalAccount: string) => void;

  // Data access functions
  getDailyStats: () => DailyEvaluationStats[];
  getTodaysStats: () => DailyEvaluationStats | undefined;
  getWeeklyEarnings: () => string;
}

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      currentProduct: null,
      currentContent: null,
      currentEvaluation: null,
      userStats: {
        totalEvaluations: 0,
        todayEvaluations: 0,
        totalEarned: "0.00",
        lastEvaluationDate: new Date().toDateString(),
      },
      transactions: [],
      completedEvaluations: [],
      dailyStats: [],
      globalLogoutDate: null,
      userLoginDate: null,

      setUser: (user) => {
        const state = get();
        const isNewUser = !state.userLoginDate;

        set({
          user,
          userLoginDate: isNewUser
            ? new Date().toISOString()
            : state.userLoginDate,
        });

        if (user && state.transactions.length === 0) {
          // Add welcome bonus transaction for new users
          get().addTransaction({
            type: "welcome_bonus",
            amount: "50.00",
            description: "Welcome bonus",
          });
          // Set initial balance to $50.00
          set({
            user: {
              ...user,
              balance: "50.00",
            },
          });
        }
      },

      setCurrentProduct: (product) => set({ currentProduct: product }),
      setCurrentContent: (content) => set({ currentContent: content }),
      setCurrentEvaluation: (evaluation) =>
        set({ currentEvaluation: evaluation }),

      updateBalance: (amount) => {
        const state = get();
        if (state.user) {
          const currentBalance = parseFloat(state.user.balance);
          const newBalance = currentBalance + parseFloat(amount);
          set({
            user: {
              ...state.user,
              balance: newBalance.toFixed(2),
            },
          });
        }
      },

      addTransaction: (transaction) => {
        const newTransaction = {
          id: Date.now().toString(),
          ...transaction,
          date: new Date().toISOString(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));

        // Update balance
        get().updateBalance(transaction.amount);
      },

      completeEvaluation: (contentId, contentType, earning) => {
        const now = new Date();
        const today = now.toDateString();

        set((state) => {
          const newBalance = (
            parseFloat(state.user?.balance || "0") + parseFloat(earning)
          ).toFixed(2);
          const newTotalEarned = (
            parseFloat(state.userStats.totalEarned) + parseFloat(earning)
          ).toFixed(2);

          // Update or create today's daily stats
          const existingDayIndex = state.dailyStats.findIndex(
            (day) => day.date === today
          );
          let newDailyStats = [...state.dailyStats];

          if (existingDayIndex >= 0) {
            // Update existing day
            newDailyStats[existingDayIndex] = {
              ...newDailyStats[existingDayIndex],
              evaluationsCount:
                newDailyStats[existingDayIndex].evaluationsCount + 1,
              earnings: (
                parseFloat(newDailyStats[existingDayIndex].earnings) +
                parseFloat(earning)
              ).toFixed(2),
              contentEvaluated: [
                ...newDailyStats[existingDayIndex].contentEvaluated,
                {
                  contentId,
                  type: contentType,
                  earning,
                  completedAt: now.toISOString(),
                },
              ],
            };
          } else {
            // Create new day
            newDailyStats.push({
              date: today,
              evaluationsCount: 1,
              earnings: earning,
              contentEvaluated: [
                {
                  contentId,
                  type: contentType,
                  earning,
                  completedAt: now.toISOString(),
                },
              ],
            });
          }

          return {
            user: state.user ? { ...state.user, balance: newBalance } : null,
            userStats: {
              ...state.userStats,
              totalEvaluations: state.userStats.totalEvaluations + 1,
              todayEvaluations:
                state.userStats.lastEvaluationDate === today
                  ? state.userStats.todayEvaluations + 1
                  : 1,
              totalEarned: newTotalEarned,
              lastEvaluationDate: today,
            },
            completedEvaluations: [
              ...state.completedEvaluations,
              {
                contentId,
                type: contentType,
                completedAt: now.toISOString(),
                earning,
              },
            ],
            dailyStats: newDailyStats,
            currentEvaluation: null,
          };
        });

        // Add transaction for the earning
        get().addTransaction({
          type: "evaluation_earning",
          amount: earning,
          description: `${
            contentType === "photo" ? "Photo" : "Video"
          } evaluation completed`,
        });
      },

      incrementDailyEvaluations: () => {
        const state = get();
        const today = new Date().toDateString();

        if (state.userStats.lastEvaluationDate !== today) {
          set({
            userStats: {
              ...state.userStats,
              todayEvaluations: 1,
              lastEvaluationDate: today,
            },
          });
        } else {
          set({
            userStats: {
              ...state.userStats,
              todayEvaluations: state.userStats.todayEvaluations + 1,
            },
          });
        }
      },

      resetDailyEvaluationsIfNeeded: () => {
        const state = get();
        const today = new Date().toDateString();

        if (state.userStats.lastEvaluationDate !== today) {
          set({
            userStats: {
              ...state.userStats,
              todayEvaluations: 0,
              lastEvaluationDate: today,
            },
          });
        }
      },

      logout: () => {
        // Record global logout date for 7-day lockout on ANY login
        set({
          user: null,
          currentProduct: null,
          currentEvaluation: null,
          userStats: {
            totalEvaluations: 0,
            todayEvaluations: 0,
            totalEarned: "0.00",
            lastEvaluationDate: new Date().toDateString(),
          },
          transactions: [],
          completedEvaluations: [],
          globalLogoutDate: new Date().toISOString(), // Global logout blocks all future logins
        });
      },

      isLoginBlocked: () => {
        const state = get();
        const logoutDate = state.globalLogoutDate;

        if (!logoutDate) return false;

        const logout = new Date(logoutDate);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - logout.getTime()) / (1000 * 60 * 60 * 24)
        );

        return daysDiff < 7;
      },

      getDaysUntilLoginAllowed: () => {
        const state = get();
        const logoutDate = state.globalLogoutDate;

        if (!logoutDate) return 0;

        const logout = new Date(logoutDate);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - logout.getTime()) / (1000 * 60 * 60 * 24)
        );

        return Math.max(0, 7 - daysDiff);
      },

      setPaypalAccount: (paypalAccount) => {
        const state = get();
        if (state.user) {
          set({
            user: {
              ...state.user,
              paypalAccount,
            },
          });
        }
      },

      getDailyStats: () => {
        return get().dailyStats;
      },

      getTodaysStats: () => {
        const state = get();
        const today = new Date().toDateString();
        return state.dailyStats.find((day) => day.date === today);
      },

      getWeeklyEarnings: () => {
        const state = get();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyEarnings = state.dailyStats
          .filter((day) => new Date(day.date) >= oneWeekAgo)
          .reduce((total, day) => total + parseFloat(day.earnings), 0);

        return weeklyEarnings.toFixed(2);
      },
    }),
    {
      name: "onlycash-app-state",
    }
  )
);
