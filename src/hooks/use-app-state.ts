import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import type {
  AppUser,
  AppTransaction as Transaction,
  AppEvaluation as Evaluation,
  AppStats as UserStats,
  AppContent,
} from "@/types";

interface AppState {
  user: AppUser | null;
  transactions: Transaction[];
  evaluations: Evaluation[];
  stats: UserStats | null;
  currentContent: AppContent | null;
  loading: boolean;

  // Actions
  fetchUser: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchEvaluations: () => Promise<void>;
  fetchStats: () => Promise<void>;
  updatePaypal: (paypalAccount: string) => Promise<void>;
  updateBank: (bankAccount: string) => Promise<void>;
  setCurrentContent: (content: AppContent | null) => void;
  completeEvaluation: (contentId: number, contentType: string, earning: string) => Promise<void>;
  incrementDailyEvaluations: () => Promise<void>;
  updateUserBalance: (earning: string) => Promise<void>;
  createTransaction: (type: string, amount: string, description: string) => Promise<void>;
  logout: () => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      transactions: [],
      evaluations: [],
      stats: null,
      currentContent: null,
      loading: false,

      fetchUser: async () => {
        set({ loading: true });
        try {
          const { data } = await api.get("/user/me");
          set({ user: data, loading: false });
        } catch (error) {
          set({ loading: false });
        }
      },

      fetchTransactions: async () => {
        set({ loading: true });
        try {
          const { data } = await api.get("/transactions");
          console.log("Fetched transactions from backend:", data);
          
          // Ensure all transactions have proper date fields
          const processedTransactions = data.map((transaction: any) => ({
            ...transaction,
            createdAt: transaction.createdAt || transaction.date || new Date().toISOString(),
          }));
          
          console.log("Processed transactions:", processedTransactions);
          set({ transactions: processedTransactions, loading: false });
        } catch (error) {
          console.error("Error fetching transactions:", error);
          set({ loading: false });
        }
      },

      fetchEvaluations: async () => {
        console.log("=== fetchEvaluations START ===");
        console.log("fetchEvaluations called");
        set({ loading: true });
        try {
          const { data } = await api.get("/evaluations");
          console.log("Fetched evaluations from backend:", data);
          console.log("Evaluations data type:", typeof data);
          console.log("Evaluations is array:", Array.isArray(data));
          console.log("Evaluations length:", data?.length);
          
          // Only update if we got valid data from backend
          if (data && Array.isArray(data) && data.length > 0) {
            const evaluations = data;
            console.log("Setting evaluations from backend:", evaluations);
            console.log("Setting evaluations count:", evaluations.length);
            set({ evaluations, loading: false });
            console.log("=== fetchEvaluations SUCCESS (backend) ===");
          } else {
            console.log("No valid evaluations from backend, keeping local state");
            console.log("Current local evaluations:", get().evaluations);
            set({ loading: false });
            console.log("=== fetchEvaluations SUCCESS (local) ===");
          }
        } catch (error) {
          console.error("=== fetchEvaluations ERROR ===");
          console.error("Error fetching evaluations:", error);
          console.log("Error occurred, keeping local evaluations state");
          console.log("Current local evaluations:", get().evaluations);
          set({ loading: false });
          console.log("=== fetchEvaluations ERROR END ===");
        }
      },

      fetchStats: async () => {
        set({ loading: true });
        try {
          const { data } = await api.get("/stats/summary");
          console.log("Fetched stats from backend:", data);
          
          // Check if it's a new day (midnight reset)
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
          const lastEvaluationDate = data?.lastEvaluationDate; // This should be set by backend
          
          console.log("Today's date:", today);
          console.log("Last evaluation date from backend:", lastEvaluationDate);
          
          // Reset daily count if it's a new day
          let todayEvaluations = data?.todayEvaluations || 0;
          if (lastEvaluationDate && lastEvaluationDate !== today) {
            console.log("New day detected, resetting daily count");
            todayEvaluations = 0;
          }
          
          const updatedStats = {
            ...data,
            todayEvaluations,
          };
          
          console.log("Updated stats with daily limit:", updatedStats);
          set({ stats: updatedStats, loading: false });
        } catch (error) {
          console.error("Error fetching stats:", error);
          set({ loading: false });
        }
      },

      updatePaypal: async (paypalAccount) => {
        await api.patch("/user", { paypalAccount });
        await get().fetchUser();
      },

      updateBank: async (bankAccount) => {
        await api.patch("/user", { bankAccount });
        await get().fetchUser();
      },

      setCurrentContent: (content) => {
        set({ currentContent: content });
      },

      completeEvaluation: async (contentId: number, contentType: string, earning: string) => {
        console.log("=== completeEvaluation START ===");
        console.log("completeEvaluation called with:", { contentId, contentType, earning });
        
        try {
          // Save evaluation to backend
          const evaluationData = {
            contentId: contentId,
            type: contentType,
            earning: parseFloat(earning),
          };
          
          console.log("Sending evaluation data to backend:", evaluationData);
          
          const response = await api.post("/evaluations", evaluationData);
          console.log("Backend response:", response.data);
          
          // Update local state
          set((state) => {
            console.log("Current state before update:", {
              evaluationsCount: state.evaluations.length,
              evaluations: state.evaluations
            });
            
            const newEvaluation = {
              id: response.data.id || Date.now(), // Use backend ID if available
              userId: state.user?.id || 0,
              productId: contentId, // This should match the content ID
              currentStage: contentType === "photo" ? 3 : 1,
              completed: true,
              totalEarned: earning, // This should be the exact earning value
              startedAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
              answers: {},
            };

            console.log("Creating new evaluation with productId:", newEvaluation.productId);
            console.log("Creating new evaluation with totalEarned:", newEvaluation.totalEarned);
            console.log("New evaluation object:", newEvaluation);

            const updatedEvaluations = [...state.evaluations, newEvaluation];
            console.log("Updated evaluations array:", updatedEvaluations);
            console.log("Updated evaluations count:", updatedEvaluations.length);

            const updatedState = {
              evaluations: updatedEvaluations,
              stats: state.stats ? {
                ...state.stats,
                totalEvaluations: (state.stats.totalEvaluations || 0) + 1,
                totalEarned: (parseFloat(state.stats.totalEarned || "0") + parseFloat(earning)).toFixed(2),
              } : null,
              user: state.user ? {
                ...state.user,
                balance: (parseFloat(state.user.balance || "0") + parseFloat(earning)).toFixed(2),
              } : null,
            };

            console.log("Final updated state:", updatedState);
            console.log("=== completeEvaluation SUCCESS ===");
            return updatedState;
          });
          
          // Also update user balance in backend
          await get().updateUserBalance(earning);
          
          // Create transaction for the evaluation
          const transactionDescription = `${contentType === "photo" ? "Photo" : "Video"} evaluation completed`;
          await get().createTransaction("evaluation", earning, transactionDescription);
          
        } catch (error) {
          console.error("=== completeEvaluation ERROR ===");
          console.error("Error saving evaluation to backend:", error);
          
          // Fallback: save only to local state if backend fails
          set((state) => {
            console.log("Falling back to local state only");
            console.log("Current state before fallback:", {
              evaluationsCount: state.evaluations.length,
              evaluations: state.evaluations
            });
            
            const newEvaluation = {
              id: Date.now(),
              userId: state.user?.id || 0,
              productId: contentId, // This should match the content ID
              currentStage: contentType === "photo" ? 3 : 1,
              completed: true,
              totalEarned: earning, // This should be the exact earning value
              startedAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
              answers: {},
            };

            console.log("Creating local evaluation with productId:", newEvaluation.productId);
            console.log("Creating local evaluation with totalEarned:", newEvaluation.totalEarned);
            console.log("Local evaluation object:", newEvaluation);

            const updatedEvaluations = [...state.evaluations, newEvaluation];
            console.log("Updated evaluations array (local):", updatedEvaluations);
            console.log("Updated evaluations count (local):", updatedEvaluations.length);

            const result = {
              evaluations: updatedEvaluations,
              stats: state.stats ? {
                ...state.stats,
                totalEvaluations: (state.stats.totalEvaluations || 0) + 1,
                totalEarned: (parseFloat(state.stats.totalEarned || "0") + parseFloat(earning)).toFixed(2),
              } : null,
            };
            
            console.log("Final fallback state:", result);
            console.log("=== completeEvaluation FALLBACK SUCCESS ===");
            return result;
          });
        }
      },

      incrementDailyEvaluations: async () => {
        try {
          // Use current date for midnight reset
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
          
          console.log("Current date for daily stats:", today);
          
          // Update daily stats in backend matching the schema
          const dailyStatsData = {
            date: today,
            evaluations: 1, // Increment by 1
            earned: 0, // This will be updated when evaluation is completed
          };
          
          console.log("Sending daily stats data to backend:", dailyStatsData);
          
          const response = await api.post("/daily-stats", dailyStatsData);
          console.log("Backend daily stats response:", response.data);
          
          // Update local state
          set((state) => ({
            stats: state.stats ? {
              ...state.stats,
              todayEvaluations: (state.stats.todayEvaluations || 0) + 1,
            } : null,
          }));
        } catch (error) {
          console.error("Error updating daily stats in backend:", error);
          
          // Fallback: update only local state
          set((state) => ({
            stats: state.stats ? {
              ...state.stats,
              todayEvaluations: (state.stats.todayEvaluations || 0) + 1,
            } : null,
          }));
        }
      },

      updateUserBalance: async (earning: string) => {
        try {
          // Update user balance in backend
          const balanceData = {
            balance: parseFloat(earning), // This should be the new total balance
          };
          
          console.log("Updating user balance:", balanceData);
          
          const response = await api.patch("/user/balance", balanceData);
          console.log("Backend balance update response:", response.data);
          
          // Update local user state
          set((state) => ({
            user: state.user ? {
              ...state.user,
              balance: (parseFloat(state.user.balance || "0") + parseFloat(earning)).toFixed(2),
            } : null,
          }));
        } catch (error) {
          console.error("Error updating user balance in backend:", error);
          
          // Fallback: update only local state
          set((state) => ({
            user: state.user ? {
              ...state.user,
              balance: (parseFloat(state.user.balance || "0") + parseFloat(earning)).toFixed(2),
            } : null,
          }));
        }
      },

      createTransaction: async (type: string, amount: string, description: string) => {
        try {
          // Create transaction in backend
          const transactionData = {
            type: type,
            amount: parseFloat(amount),
            description: description,
            date: new Date().toISOString(),
          };
          
          console.log("Creating transaction:", transactionData);
          
          const response = await api.post("/transactions", transactionData);
          console.log("Backend transaction response:", response.data);
          
          // Update local state with the response data
          set((state) => ({
            transactions: [...state.transactions, response.data],
          }));
        } catch (error) {
          console.error("Error creating transaction in backend:", error);
          
          // Fallback: create only in local state
          const newTransaction = {
            id: Date.now(),
            userId: get().user?.id || 0,
            type: type,
            amount: amount,
            description: description,
            createdAt: new Date().toISOString(),
          };
          
          console.log("Creating local transaction:", newTransaction);
          
          set((state) => ({
            transactions: [...state.transactions, newTransaction],
          }));
        }
      },

      logout: () => {
        localStorage.removeItem("access_token");
        set({
          user: null,
          transactions: [],
          evaluations: [],
          stats: null,
          currentContent: null,
          loading: false,
        });
      },
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        evaluations: state.evaluations,
        stats: state.stats,
        user: state.user,
      }),
    }
  )
);