import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppUser, AppProduct, AppEvaluation } from '../types';

interface UserStats {
  totalEvaluations: number;
  todayEvaluations: number;
  totalEarned: string;
  lastEvaluationDate: string;
}

interface AppState {
  user: AppUser | null;
  currentProduct: AppProduct | null;
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
    productId: number;
    completedAt: string;
    earning: string;
  }>;
  
  // Actions
  setUser: (user: AppUser | null) => void;
  setCurrentProduct: (product: AppProduct | null) => void;
  setCurrentEvaluation: (evaluation: AppEvaluation | null) => void;
  updateBalance: (amount: string) => void;
  addTransaction: (transaction: {
    type: string;
    amount: string;
    description: string;
  }) => void;
  completeEvaluation: (productId: number, earning: string) => void;
  incrementDailyEvaluations: () => void;
  resetDailyEvaluationsIfNeeded: () => void;
  logout: () => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
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
      
      setUser: (user) => {
        set({ user });
        if (user && get().transactions.length === 0) {
          // Add welcome bonus transaction for new users
          get().addTransaction({
            type: 'welcome_bonus',
            amount: '50.00',
            description: 'Welcome bonus'
          });
          // Set initial balance to $50.00
          set({
            user: {
              ...user,
              balance: '50.00'
            }
          });
        }
      },
      
      setCurrentProduct: (product) => set({ currentProduct: product }),
      setCurrentEvaluation: (evaluation) => set({ currentEvaluation: evaluation }),
      
      updateBalance: (amount) => {
        const state = get();
        if (state.user) {
          const currentBalance = parseFloat(state.user.balance);
          const newBalance = currentBalance + parseFloat(amount);
          set({
            user: {
              ...state.user,
              balance: newBalance.toFixed(2)
            }
          });
        }
      },
      
      addTransaction: (transaction) => {
        const newTransaction = {
          id: Date.now().toString(),
          ...transaction,
          date: new Date().toISOString()
        };
        set(state => ({
          transactions: [newTransaction, ...state.transactions]
        }));
        
        // Update balance
        get().updateBalance(transaction.amount);
      },
      
      completeEvaluation: (productId, earning) => {
        const state = get();
        const today = new Date().toDateString();
        
        // Add completed evaluation
        set(state => ({
          completedEvaluations: [
            {
              productId,
              completedAt: new Date().toISOString(),
              earning
            },
            ...state.completedEvaluations
          ]
        }));
        
        // Update stats
        const newTotalEvaluations = state.userStats.totalEvaluations + 1;
        const newTodayEvaluations = state.userStats.lastEvaluationDate === today 
          ? state.userStats.todayEvaluations + 1 
          : 1;
        const newTotalEarned = (parseFloat(state.userStats.totalEarned) + parseFloat(earning)).toFixed(2);
        
        set({
          userStats: {
            totalEvaluations: newTotalEvaluations,
            todayEvaluations: newTodayEvaluations,
            totalEarned: newTotalEarned,
            lastEvaluationDate: today
          }
        });
        
        // Add transaction
        get().addTransaction({
          type: 'evaluation_completed',
          amount: earning,
          description: `Product evaluation completed`
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
              lastEvaluationDate: today
            }
          });
        } else {
          set({
            userStats: {
              ...state.userStats,
              todayEvaluations: state.userStats.todayEvaluations + 1
            }
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
              lastEvaluationDate: today
            }
          });
        }
      },
      
      logout: () => set({ 
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
        completedEvaluations: []
      }),
    }),
    {
      name: 'safemoney-app-state',
    }
  )
);
