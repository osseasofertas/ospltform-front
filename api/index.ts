import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// Middleware essencial
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuração de CORS otimizada para Vercel
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://safemoney.vercel.app',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  ].filter(Boolean);

  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Health check para Vercel
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configured' : 'missing'
  });
});

// Verificar variáveis de ambiente essenciais
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('💡 Configure DATABASE_URL in Vercel dashboard');
}

// Inicializar rotas com tratamento de erro
let routesInitialized = false;

const initializeRoutes = async () => {
  if (routesInitialized) return;
  
  try {
    console.log('🚀 Initializing SafeMoney routes...');
    const server = await registerRoutes(app);
    routesInitialized = true;
    console.log('✅ Routes registered successfully');
    return server;
  } catch (error) {
    console.error('❌ Error registering routes:', error);
    throw error;
  }
};

// Middleware para garantir que as rotas estejam inicializadas
app.use(async (req, res, next) => {
  if (!routesInitialized && !req.path.includes('/health')) {
    try {
      await initializeRoutes();
    } catch (error) {
      return res.status(500).json({ 
        error: 'Server initialization failed',
        message: error.message 
      });
    }
  }
  next();
});

// Inicializar rotas na primeira execução
initializeRoutes().catch(console.error);

export default app;