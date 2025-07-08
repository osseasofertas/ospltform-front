import { 
  users, 
  products, 
  evaluations, 
  transactions, 
  questions,
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct,
  type Evaluation,
  type InsertEvaluation,
  type Transaction,
  type InsertTransaction,
  type Question,
  type InsertQuestion
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, amount: string): Promise<void>;
  updateUserDailyEvaluations(userId: number, count: number): Promise<void>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Evaluation operations
  getEvaluation(userId: number, productId: number): Promise<Evaluation | undefined>;
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
  updateEvaluation(id: number, data: Partial<Evaluation>): Promise<void>;
  getUserEvaluations(userId: number): Promise<Evaluation[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  
  // Question operations
  getQuestionsByProduct(productId: number, stage: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Stats operations
  getUserStats(userId: number): Promise<{
    totalEvaluations: number;
    todayEvaluations: number;
    totalEarned: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    
    // Create welcome bonus transaction
    await this.createTransaction({
      userId: user.id,
      type: 'welcome_bonus',
      amount: '289.00',
      description: 'Bono de bienvenida',
    });
    
    return user;
  }

  async updateUserBalance(userId: number, amount: string): Promise<void> {
    await db
      .update(users)
      .set({ balance: sql`${users.balance} + ${amount}` })
      .where(eq(users.id, userId));
  }

  async updateUserDailyEvaluations(userId: number, count: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        dailyEvaluationsUsed: count,
        lastEvaluationDate: new Date()
      })
      .where(eq(users.id, userId));
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.active, true));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getEvaluation(userId: number, productId: number): Promise<Evaluation | undefined> {
    const [evaluation] = await db
      .select()
      .from(evaluations)
      .where(and(
        eq(evaluations.userId, userId),
        eq(evaluations.productId, productId),
        eq(evaluations.completed, false)
      ));
    return evaluation;
  }

  async createEvaluation(insertEvaluation: InsertEvaluation): Promise<Evaluation> {
    const [evaluation] = await db
      .insert(evaluations)
      .values(insertEvaluation)
      .returning();
    return evaluation;
  }

  async updateEvaluation(id: number, data: Partial<Evaluation>): Promise<void> {
    await db
      .update(evaluations)
      .set(data)
      .where(eq(evaluations.id, id));
  }

  async getUserEvaluations(userId: number): Promise<Evaluation[]> {
    return await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.userId, userId))
      .orderBy(desc(evaluations.startedAt));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async getQuestionsByProduct(productId: number, stage: number): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(and(
        eq(questions.productId, productId),
        eq(questions.stage, stage)
      ))
      .orderBy(questions.questionNumber);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  async getUserStats(userId: number): Promise<{
    totalEvaluations: number;
    todayEvaluations: number;
    totalEarned: string;
  }> {
    const [stats] = await db
      .select({
        totalEvaluations: sql<number>`COUNT(*)`,
        totalEarned: sql<string>`COALESCE(SUM(${evaluations.totalEarned}), 0)`,
      })
      .from(evaluations)
      .where(and(
        eq(evaluations.userId, userId),
        eq(evaluations.completed, true)
      ));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayStats] = await db
      .select({
        todayEvaluations: sql<number>`COUNT(*)`,
      })
      .from(evaluations)
      .where(and(
        eq(evaluations.userId, userId),
        eq(evaluations.completed, true),
        sql`${evaluations.completedAt} >= ${today}`
      ));

    return {
      totalEvaluations: stats.totalEvaluations || 0,
      todayEvaluations: todayStats.todayEvaluations || 0,
      totalEarned: stats.totalEarned || '0.00',
    };
  }
}

export const storage = new DatabaseStorage();
