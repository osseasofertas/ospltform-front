export interface AppUser {
  id: number;
  name: string;
  email: string;
  balance: string;
  registrationDate: string;
  dailyEvaluationsUsed: number;
  isDemo: boolean;
  paypalAccount?: string; // PayPal account field
  bankAccount?: string; 
}

export interface AppProduct {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  minEarning: string;
  maxEarning: string;
  active: boolean;
}

export interface AppContent {
  id: number;
  type: "photo" | "video";
  title: string;
  url: string;
  minEarning: string;
  maxEarning: string;
  week: number;
}

export interface AppEvaluation {
  id: number;
  userId: number;
  productId: number;
  contentId?: number; // Add contentId for backend compatibility
  currentStage: number;
  completed: boolean;
  totalEarned: string;
  startedAt: string;
  completedAt?: string;
  answers: Record<string, any>;
}

export interface AppTransaction {
  id: number;
  userId: number;
  evaluationId?: number;
  type: string;
  amount: string;
  description: string;
  createdAt: string;
}

export interface AppQuestion {
  id: number;
  productId: number;
  stage: number;
  questionNumber: number;
  type: "multiple_choice" | "star_rating" | "free_text";
  question: string;
  options?: string[];
  metadata?: Record<string, any>;
}

export interface AppStats {
  totalEvaluations: number;
  todayEvaluations: number;
  totalEarned: string;
}
