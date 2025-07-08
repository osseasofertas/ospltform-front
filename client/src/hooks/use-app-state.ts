import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppUser, AppProduct, AppEvaluation } from '../types';

interface AppState {
  user: AppUser | null;
  currentProduct: AppProduct | null;
  currentEvaluation: AppEvaluation | null;
  setUser: (user: AppUser | null) => void;
  setCurrentProduct: (product: AppProduct | null) => void;
  setCurrentEvaluation: (evaluation: AppEvaluation | null) => void;
  logout: () => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentProduct: null,
      currentEvaluation: null,
      setUser: (user) => set({ user }),
      setCurrentProduct: (product) => set({ currentProduct: product }),
      setCurrentEvaluation: (evaluation) => set({ currentEvaluation: evaluation }),
      logout: () => set({ user: null, currentProduct: null, currentEvaluation: null }),
    }),
    {
      name: 'safemoney-app-state',
    }
  )
);
