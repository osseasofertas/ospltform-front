import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());

// Configuração de CORS para o frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Inicializar rotas
registerRoutes(app).then(() => {
  console.log('Routes registered successfully');
}).catch((error) => {
  console.error('Error registering routes:', error);
});

export default app;