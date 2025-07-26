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
  completeEvaluation: (contentId: number, contentType: string, earning: string) => void;
  incrementDailyEvaluations: () => void;
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
          set({ transactions: data, loading: false });
        } catch (error) {
          set({ loading: false });
        }
      },

      fetchEvaluations: async () => {
        set({ loading: true });
        try {
          const { data } = await api.get("/evaluations");
          set({ evaluations: data ?? [], loading: false });
        } catch (error) {
          set({ loading: false });
        }
      },

      fetchStats: async () => {
        set({ loading: true });
        try {
          const { data } = await api.get("/stats/summary");
          set({ stats: data, loading: false });
        } catch (error) {
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

      completeEvaluation: (contentId, contentType, earning) => {
        console.log("completeEvaluation called with:", { contentId, contentType, earning });
        
        set((state) => {
          const newEvaluation = {
            id: Date.now(), // Generate a unique ID
            userId: state.user?.id || 0,
            productId: contentId,
            currentStage: contentType === "photo" ? 3 : 1,
            completed: true,
            totalEarned: earning,
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            answers: {},
          };

          console.log("Creating new evaluation:", newEvaluation);
          console.log("Current evaluations count:", state.evaluations.length);

          const updatedState = {
            evaluations: [...state.evaluations, newEvaluation],
            stats: state.stats ? {
              ...state.stats,
              totalEvaluations: (state.stats.totalEvaluations || 0) + 1,
              totalEarned: (parseFloat(state.stats.totalEarned || "0") + parseFloat(earning)).toFixed(2),
            } : null,
          };

          console.log("Updated state:", updatedState);
          return updatedState;
        });
      },

      incrementDailyEvaluations: () => {
        set((state) => ({
          stats: state.stats ? {
            ...state.stats,
            todayEvaluations: (state.stats.todayEvaluations || 0) + 1,
          } : null,
        }));
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