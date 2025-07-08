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
        return res.status(400).json({ message: "El usuario ya existe" });
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
      res.status(400).json({ message: "Error al registrar usuario" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciales inválidas" });
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
      res.status(400).json({ message: "Error al iniciar sesión" });
    }
  });

  app.post("/api/auth/demo", async (req, res) => {
    try {
      const demoUser = await storage.createUser({
        name: "Usuario Demo",
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
      res.status(500).json({ message: "Error al crear usuario demo" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error al obtener productos" });
    }
  });

  // Evaluation routes
  app.get("/api/evaluations/draft", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const productId = parseInt(req.query.productId as string);
      
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
      res.status(500).json({ message: "Error al obtener borrador" });
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
      res.status(500).json({ message: "Error al guardar borrador" });
    }
  });

  app.delete("/api/evaluations/draft/:draftId", async (req, res) => {
    try {
      const draftId = parseInt(req.params.draftId);
      await storage.updateEvaluation(draftId, { completed: true });
      res.json({ message: "Borrador eliminado" });
    } catch (error) {
      console.error("Error deleting draft:", error);
      res.status(500).json({ message: "Error al eliminar borrador" });
    }
  });

  app.post("/api/evaluations", async (req, res) => {
    try {
      const { userId, productId, answers } = req.body;
      
      // Calculate earnings based on product
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
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
        description: 'Evaluación completada',
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
      res.status(500).json({ message: "Error al completar evaluación" });
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
      res.status(500).json({ message: "Error al obtener preguntas" });
    }
  });



  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
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
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  });

  app.get("/api/users/:id/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Error al obtener estadísticas" });
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
      res.status(500).json({ message: "Error al obtener transacciones" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeSampleData() {
  try {
    // Create sample products
    const products = [
      {
        name: "Smartphone Premium XR",
        category: "Tecnología",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        minEarning: "2.50",
        maxEarning: "4.00",
      },
      {
        name: "Auriculares Bluetooth Pro",
        category: "Audio",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        minEarning: "1.80",
        maxEarning: "3.20",
      },
      {
        name: "Cafetera Eléctrica Deluxe",
        category: "Hogar",
        imageUrl: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        minEarning: "1.00",
        maxEarning: "2.50",
      },
      {
        name: "Reloj Fitness Tracker",
        category: "Deporte",
        imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        minEarning: "1.50",
        maxEarning: "3.00",
      },
    ];

    // Check if products already exist
    const existingProducts = await storage.getProducts();
    if (existingProducts.length === 0) {
      for (const product of products) {
        await storage.createProduct(product);
      }
    }

    // Create sample questions for each product
    const sampleQuestions = [
      {
        stage: 1,
        questionNumber: 1,
        type: "multiple_choice",
        question: "¿Cuál es tu rango de edad?",
        options: ["18-25 años", "26-35 años", "36-45 años", "46+ años"],
      },
      {
        stage: 1,
        questionNumber: 2,
        type: "star_rating",
        question: "¿Qué tan importante es la calidad de este producto?",
        metadata: { minLabel: "Poco importante", maxLabel: "Muy importante" },
      },
      {
        stage: 1,
        questionNumber: 3,
        type: "free_text",
        question: "¿Qué características adicionales te gustaría ver en este producto?",
      },
      {
        stage: 1,
        questionNumber: 4,
        type: "multiple_choice",
        question: "¿Con qué frecuencia usarías este producto?",
        options: ["Diariamente", "Semanalmente", "Mensualmente", "Raramente"],
      },
      {
        stage: 1,
        questionNumber: 5,
        type: "star_rating",
        question: "¿Cómo calificarías el precio de este producto?",
        metadata: { minLabel: "Muy caro", maxLabel: "Muy barato" },
      },
    ];

    // Add questions for each product and stage
    const allProducts = await storage.getProducts();
    for (const product of allProducts) {
      for (let stage = 1; stage <= 3; stage++) {
        for (const questionTemplate of sampleQuestions) {
          const existingQuestions = await storage.getQuestionsByProduct(product.id, stage);
          if (existingQuestions.length === 0) {
            await storage.createQuestion({
              productId: product.id,
              stage,
              questionNumber: questionTemplate.questionNumber,
              type: questionTemplate.type,
              question: questionTemplate.question,
              options: questionTemplate.options || null,
              metadata: questionTemplate.metadata || null,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}
