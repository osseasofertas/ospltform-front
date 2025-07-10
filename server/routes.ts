import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEvaluationSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const answerSchema = z.object({
  questionId: z.number(),
  answer: z.any(),
});

const saveAnswersSchema = z.object({
  evaluationId: z.number(),
  stage: z.number(),
  answers: z.array(answerSchema),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize sample data
  await initializeSampleData();

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          balance: user.balance,
          registrationDate: user.registrationDate,
          dailyEvaluationsUsed: user.dailyEvaluationsUsed,
          isDemo: user.isDemo
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Error registering user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          balance: user.balance,
          registrationDate: user.registrationDate,
          dailyEvaluationsUsed: user.dailyEvaluationsUsed,
          isDemo: user.isDemo
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Error logging in" });
    }
  });

  app.post("/api/auth/demo", async (req, res) => {
    try {
      const demoUser = await storage.createUser({
        name: "Demo User",
        email: `demo_${Date.now()}@demo.com`,
        password: "demo123",
        isDemo: true,
      });
      
      res.json({ 
        user: { 
          id: demoUser.id, 
          name: demoUser.name, 
          email: demoUser.email, 
          balance: demoUser.balance,
          registrationDate: demoUser.registrationDate,
          dailyEvaluationsUsed: demoUser.dailyEvaluationsUsed,
          isDemo: demoUser.isDemo
        } 
      });
    } catch (error) {
      console.error("Demo user creation error:", error);
      res.status(500).json({ message: "Error creating demo user" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      
      // Check daily evaluation limit (25 evaluations per day)
      if (userId) {
        const stats = await storage.getUserStats(userId);
        if (stats.todayEvaluations >= 25) {
          return res.status(429).json({ 
            message: "Daily limit reached. You can evaluate up to 25 products per day.",
            limitReached: true,
            todayEvaluations: stats.todayEvaluations,
            limit: 25
          });
        }
      }
      
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  // Evaluation routes
  app.get("/api/evaluations/draft", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const productId = parseInt(req.query.productId as string);
      
      if (isNaN(userId) || isNaN(productId)) {
        return res.json({ draft: null });
      }
      
      const evaluation = await storage.getEvaluation(userId, productId);
      
      if (!evaluation) {
        return res.json({ draft: null });
      }

      res.json({ 
        draft: {
          draftId: evaluation.id,
          stage: evaluation.currentStage,
          partialAnswers: evaluation.answers
        }
      });
    } catch (error) {
      console.error("Error fetching draft:", error);
      res.status(500).json({ message: "Error fetching draft" });
    }
  });

  app.post("/api/evaluations/draft", async (req, res) => {
    try {
      const { draftId, userId, productId, stage, partialAnswers } = req.body;
      
      if (draftId) {
        // Update existing draft
        await storage.updateEvaluation(draftId, {
          currentStage: stage,
          answers: partialAnswers,
        });
        res.json({ draftId });
      } else {
        // Create new draft
        const evaluation = await storage.createEvaluation({
          userId,
          productId,
          currentStage: stage,
          answers: partialAnswers,
        });
        res.json({ draftId: evaluation.id });
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      res.status(500).json({ message: "Error saving draft" });
    }
  });

  app.delete("/api/evaluations/draft/:draftId", async (req, res) => {
    try {
      const draftId = parseInt(req.params.draftId);
      await storage.updateEvaluation(draftId, { completed: true });
      res.json({ message: "Draft deleted" });
    } catch (error) {
      console.error("Error deleting draft:", error);
      res.status(500).json({ message: "Error deleting draft" });
    }
  });

  app.post("/api/evaluations", async (req, res) => {
    try {
      const { userId, productId, answers } = req.body;
      
      // Calculate earnings based on product
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const minEarning = parseFloat(product.minEarning);
      const maxEarning = parseFloat(product.maxEarning);
      const earning = (Math.random() * (maxEarning - minEarning) + minEarning).toFixed(2);
      
      // Create completed evaluation
      const evaluation = await storage.createEvaluation({
        userId,
        productId,
        currentStage: 3,
        completed: true,
        answers,
      });
      
      // Update with earnings
      await storage.updateEvaluation(evaluation.id, {
        totalEarned: earning,
        completedAt: new Date(),
      });

      // Update user balance
      await storage.updateUserBalance(userId, earning);

      // Create transaction
      await storage.createTransaction({
        userId,
        evaluationId: evaluation.id,
        type: 'evaluation_stage',
        amount: earning,
        description: 'Evaluation completed',
      });

      // Update daily evaluations count
      const user = await storage.getUser(userId);
      if (user) {
        const today = new Date();
        const lastEvaluation = user.lastEvaluationDate;
        let dailyCount = user.dailyEvaluationsUsed;
        
        if (!lastEvaluation || lastEvaluation.toDateString() !== today.toDateString()) {
          dailyCount = 1;
        } else {
          dailyCount += 1;
        }
        
        await storage.updateUserDailyEvaluations(userId, dailyCount);
      }

      res.json({ earning });
    } catch (error) {
      console.error("Error completing evaluation:", error);
      res.status(500).json({ message: "Error completing evaluation" });
    }
  });

  // Question routes
  app.get("/api/products/:productId/questions", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const stage = parseInt(req.query.stage as string);
      
      const questions = await storage.getQuestionsByProduct(productId, stage);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Error fetching questions" });
    }
  });



  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        balance: user.balance,
        registrationDate: user.registrationDate,
        dailyEvaluationsUsed: user.dailyEvaluationsUsed,
        isDemo: user.isDemo
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  app.get("/api/users/:id/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  // Transaction routes
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  // Payout method registration
  app.post("/api/payout-method", async (req, res) => {
    try {
      console.log('Received payout method registration request:', req.body);
      const { userId, method } = req.body;
      
      // Validate method
      if (!method || !['PayPal', 'Bank deposit'].includes(method)) {
        console.log('Invalid payout method:', method);
        return res.status(400).json({ error: 'Invalid payout method' });
      }
      
      // For now, we just return success since we're not storing sensitive data
      // In a real implementation, you might log this preference or send to a secure payment processor
      console.log(`User ${userId || 1} registered payout method: ${method}`);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error registering payout method:", error);
      res.status(500).json({ error: 'Error registering payout method' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeSampleData() {
  try {
    // Create sample products using real product images (8 products from 343 available)
    const products = [
      {
        name: "Product",
        category: "Clothing",
        imageUrl: "/attached_assets/prints/PT2.png",
        minEarning: "2.50",
        maxEarning: "4.00",
      },
      {
        name: "Product",
        category: "Home",
        imageUrl: "/attached_assets/prints/PT3.png",
        minEarning: "1.80",
        maxEarning: "3.20",
      },
      {
        name: "Product",
        category: "Automotive",
        imageUrl: "/attached_assets/prints/PT10.png",
        minEarning: "3.00",
        maxEarning: "5.00",
      },
      {
        name: "Product",
        category: "Tools",
        imageUrl: "/attached_assets/prints/PT50.png",
        minEarning: "1.00",
        maxEarning: "2.50",
      },
      {
        name: "Product",
        category: "Electronics",
        imageUrl: "/attached_assets/prints/PT75.png",
        minEarning: "2.80",
        maxEarning: "4.20",
      },
      {
        name: "Product",
        category: "Sports",
        imageUrl: "/attached_assets/prints/PT100.png",
        minEarning: "1.50",
        maxEarning: "3.50",
      },
      {
        name: "Product",
        category: "Beauty",
        imageUrl: "/attached_assets/prints/PT150.png",
        minEarning: "2.20",
        maxEarning: "3.80",
      },
      {
        name: "Product",
        category: "Kitchen",
        imageUrl: "/attached_assets/prints/PT200.png",
        minEarning: "1.75",
        maxEarning: "3.25",
      },
    ];

    // Check if products already exist
    const existingProducts = await storage.getProducts();
    if (existingProducts.length === 0) {
      for (const product of products) {
        await storage.createProduct(product);
      }
    }

    // Create comprehensive questions for each stage
    const stageQuestions = {
      1: [
        {
          questionNumber: 1,
          type: "multiple_choice",
          question: "What is your age range?",
          options: ["18-25 years", "26-35 years", "36-45 years", "46+ years"],
        },
        {
          questionNumber: 2,
          type: "free_text",
          question: "What specific problem do you expect to solve with this product? Explain in detail.",
        },
        {
          questionNumber: 3,
          type: "multiple_choice",
          question: "What is your experience level with similar products?",
          options: ["Never used anything similar", "Beginner", "Intermediate", "Expert"],
        },
        {
          questionNumber: 4,
          type: "free_text",
          question: "Describe a specific situation where you would use this product. Where, when, and how?",
        },
        {
          questionNumber: 5,
          type: "star_rating",
          question: "How important is the quality of this product to you?",
          metadata: { minLabel: "Not important", maxLabel: "Very important" },
        },
      ],
      2: [
        {
          questionNumber: 1,
          type: "free_text",
          question: "What additional features would you like to see in this product that are not currently available?",
        },
        {
          questionNumber: 2,
          type: "multiple_choice",
          question: "How often would you use this product?",
          options: ["Daily", "Several times per week", "Weekly", "Monthly", "Rarely"],
        },
        {
          questionNumber: 3,
          type: "free_text",
          question: "What do you like most about this product compared to similar ones on the market?",
        },
        {
          questionNumber: 4,
          type: "multiple_choice",
          question: "What would be your maximum budget for this type of product?",
          options: ["Less than $10", "$10-20", "$20-40", "$40-100", "More than $100"],
        },
        {
          questionNumber: 5,
          type: "star_rating",
          question: "How would you rate the price of this product?",
          metadata: { minLabel: "Very expensive", maxLabel: "Very cheap" },
        },
      ],
      3: [
        {
          questionNumber: 1,
          type: "free_text",
          question: "What improvements or changes would you suggest to make this product more attractive?",
        },
        {
          questionNumber: 2,
          type: "multiple_choice",
          question: "Would you recommend this product to friends or family?",
          options: ["Definitely yes", "Probably yes", "Maybe", "Probably no", "Definitely no"],
        },
        {
          questionNumber: 3,
          type: "free_text",
          question: "What negative aspects or limitations do you see in this product?",
        },
        {
          questionNumber: 4,
          type: "multiple_choice",
          question: "What is the most important characteristic for you in this type of product?",
          options: ["Price", "Quality", "Design", "Functionality", "Brand"],
        },
        {
          questionNumber: 5,
          type: "free_text",
          question: "In a few words, what would be your overall review of this product?",
        },
      ],
    };

    // Add questions for each product and stage
    const allProducts = await storage.getProducts();
    for (const product of allProducts) {
      for (let stage = 1; stage <= 3; stage++) {
        const existingQuestions = await storage.getQuestionsByProduct(product.id, stage);
        if (existingQuestions.length === 0) {
          const questionsForStage = stageQuestions[stage as keyof typeof stageQuestions];
          for (const questionTemplate of questionsForStage) {
            await storage.createQuestion({
              productId: product.id,
              stage,
              questionNumber: questionTemplate.questionNumber,
              type: questionTemplate.type,
              question: questionTemplate.question,
              options: questionTemplate.options || null,
              metadata: (questionTemplate as any).metadata || null,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}
