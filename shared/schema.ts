import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("50.00").notNull(),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  dailyEvaluationsUsed: integer("daily_evaluations_used").default(0).notNull(),
  lastEvaluationDate: timestamp("last_evaluation_date"),
  isDemo: boolean("is_demo").default(false).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  minEarning: decimal("min_earning", { precision: 10, scale: 2 }).notNull(),
  maxEarning: decimal("max_earning", { precision: 10, scale: 2 }).notNull(),
  active: boolean("active").default(true).notNull(),
});

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  currentStage: integer("current_stage").default(1).notNull(),
  completed: boolean("completed").default(false).notNull(),
  totalEarned: decimal("total_earned", { precision: 10, scale: 2 }).default("0.00").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  answers: jsonb("answers").default({}).notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  evaluationId: integer("evaluation_id").references(() => evaluations.id),
  type: text("type").notNull(), // 'welcome_bonus', 'evaluation_stage', 'withdrawal'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  stage: integer("stage").notNull(), // 1, 2, or 3
  questionNumber: integer("question_number").notNull(), // 1-5
  type: text("type").notNull(), // 'multiple_choice', 'star_rating', 'free_text'
  question: text("question").notNull(),
  options: jsonb("options"), // for multiple choice questions
  metadata: jsonb("metadata"), // additional question config
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  evaluations: many(evaluations),
  transactions: many(transactions),
}));

export const productsRelations = relations(products, ({ many }) => ({
  evaluations: many(evaluations),
  questions: many(questions),
}));

export const evaluationsRelations = relations(evaluations, ({ one, many }) => ({
  user: one(users, { fields: [evaluations.userId], references: [users.id] }),
  product: one(products, { fields: [evaluations.productId], references: [products.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  evaluation: one(evaluations, { fields: [transactions.evaluationId], references: [evaluations.id] }),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  product: one(products, { fields: [questions.productId], references: [products.id] }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  registrationDate: true,
  dailyEvaluationsUsed: true,
  lastEvaluationDate: true,
  balance: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertEvaluationSchema = createInsertSchema(evaluations).omit({
  id: true,
  startedAt: true,
  completedAt: true,
  totalEarned: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;
export type Evaluation = typeof evaluations.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
