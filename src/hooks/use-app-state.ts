import { create } from "zustand";
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
  logout: () => void;
}

export const useAppState = create<AppState>((set) => ({
  user: null,
  transactions: [],
  evaluations: [],
  stats: null,
  currentContent: null,
  loading: false,

  fetchUser: async () => {
    set({ loading: true });
    const { data } = await api.get("/user/me");
    set({ user: data, loading: false });
  },

  fetchTransactions: async () => {
    set({ loading: true });
    const { data } = await api.get("/transactions");
    set({ transactions: data, loading: false });
  },

  fetchEvaluations: async () => {
    set({ loading: true });
    const { data } = await api.get("/evaluations");
    set({ evaluations: data ?? [], loading: false });
  },

  fetchStats: async () => {
    set({ loading: true });
    const { data } = await api.get("/stats/summary");
    set({ stats: data, loading: false });
    // Para dailyStats:
    // const { data: daily } = await api.get("/stats/daily");
    // set({ dailyStats: daily });
  },

  updatePaypal: async (paypalAccount) => {
    await api.patch("/user", { paypalAccount });
    await useAppState.getState().fetchUser();
  },

  updateBank: async (bankAccount) => {
    await api.patch("/user", { bankAccount });
    await useAppState.getState().fetchUser();
  },

  setCurrentContent: (content) => {
    set({ currentContent: content });
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
}));