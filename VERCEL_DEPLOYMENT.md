# Vercel Deployment Guide for SafeMoney

## Estrutura do Projeto para Vercel

O projeto SafeMoney foi configurado para deployment no Vercel com a seguinte estrutura:

```
SafeMoney/
├── api/
│   └── index.ts          # Função serverless principal
├── client/               # Frontend React
├── server/               # Backend para desenvolvimento local
├── shared/               # Schemas compartilhados
├── dist/
│   └── public/          # Build do frontend
├── vercel.json          # Configuração do Vercel
├── tsconfig.server.json # Config TypeScript para servidor
└── .vercelignore        # Arquivos ignorados no deploy
```

## Configuração Principal (vercel.json)

A configuração do Vercel foi otimizada para:
- **Framework**: null (configuração manual)
- **Build**: `vite build` para o frontend
- **Output**: `dist/public` para servir arquivos estáticos
- **Rewrites**: Redirecionamento de API e SPA
- **Funções**: Serverless com 1024MB RAM e 10s timeout

## Função Serverless (api/index.ts)

A função serverless principal:
- Configura Express.js com middleware CORS
- Registra todas as rotas do backend
- Gerencia conexões com banco PostgreSQL
- Suporta todas as funcionalidades do SafeMoney

## Variáveis de Ambiente

Configure as seguintes variáveis no painel do Vercel:

### Banco de Dados
```bash
DATABASE_URL=your_postgres_connection_string
PGHOST=your_postgres_host
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=your_database_name
PGPORT=5432
```

## Passos para Deploy

### 1. Preparação do Projeto
```bash
# Instalar dependências
npm install

# Testar build local
npm run build

# Verificar estrutura de arquivos
ls -la dist/public/
```

### 2. Deploy no Vercel

#### Opção A: Vercel CLI
```bash
# Instalar CLI do Vercel
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

#### Opção B: GitHub Integration
1. Conectar repositório no painel do Vercel
2. Configurar variáveis de ambiente
3. Deploy automático será executado

### 3. Configuração Pós-Deploy

1. **Configurar domínio personalizado** (opcional)
2. **Verificar logs** no painel do Vercel
3. **Testar funcionalidades principais**:
   - Registro de usuários
   - Avaliação de produtos
   - Sistema de pagamento
   - Transações

## Funcionalidades Suportadas

✅ **Frontend React** - Totalmente funcional
✅ **API Routes** - Todas as rotas preservadas
✅ **Banco PostgreSQL** - Conexão via Neon/Supabase
✅ **Autenticação** - Sistema de sessões
✅ **Uploads** - Gerenciamento de arquivos
✅ **Real-time** - Atualizações de saldo
✅ **Mobile-first** - Design responsivo

## Monitoramento

O Vercel fornece:
- **Analytics** de performance
- **Logs** de funções serverless
- **Métricas** de uso
- **Alertas** de erro

## Troubleshooting

### Erro de Build
```bash
# Verificar dependências
npm install

# Limpar cache
rm -rf node_modules dist
npm install
```

### Erro de Conexão BD
1. Verificar variáveis de ambiente
2. Confirmar whitelist de IPs
3. Testar conexão localmente

### Erro de Timeout
1. Otimizar queries do banco
2. Aumentar timeout da função
3. Implementar cache

## Diferenças entre Replit e Vercel

| Aspecto | Replit | Vercel |
|---------|---------|---------|
| Servidor | Always-on | Serverless |
| Banco | PostgreSQL local | PostgreSQL externo |
| Build | Automático | Manual/CI |
| Logs | Console direto | Dashboard |
| Domínio | .replit.app | .vercel.app |

## Manutenção

### Atualizações
```bash
# Atualizar código
git push origin main

# Deploy manual
vercel --prod
```

### Backup
- Banco de dados: Configurar backup automático
- Código: Versionamento Git
- Configurações: Documentar variáveis

## Suporte

Para problemas específicos:
1. Verificar logs no painel Vercel
2. Testar localmente com `npm run dev`
3. Consultar documentação oficial do Vercel
4. Contatar suporte técnico se necessário

---

**Nota**: Esta configuração garante que o SafeMoney funcione perfeitamente tanto no ambiente Replit quanto no Vercel em produção.