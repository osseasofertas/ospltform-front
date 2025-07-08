# Configuração de Banco de Dados no Vercel - SafeMoney

## Análise dos Requisitos do Vercel

### Limites de Variáveis de Ambiente
- **Total**: 64 KB para todas as variáveis combinadas
- **Por variável**: Máximo 64 KB cada
- **Edge Functions**: Limitado a 5 KB por variável (não aplicável ao nosso caso)

### Tipos de Ambiente
- **Production**: Deploy de produção (branch main)
- **Preview**: Deploys de preview (outras branches)
- **Development**: Desenvolvimento local (`vercel dev`)

## Configuração Necessária para SafeMoney

### 1. Variáveis de Ambiente Obrigatórias

Configure estas variáveis no painel do Vercel:

#### Banco de Dados PostgreSQL
```bash
# String de conexão principal (OBRIGATÓRIO)
DATABASE_URL=postgresql://usuario:senha@host:porta/database?sslmode=require

# Variáveis individuais para compatibilidade
PGHOST=seu-host-postgres.com
PGUSER=seu_usuario
PGPASSWORD=sua_senha_segura
PGDATABASE=safemoney
PGPORT=5432

# Ambiente de execução
NODE_ENV=production
```

### 2. Provedores de Banco Recomendados

#### Opção 1: Neon (Recomendado)
- **URL**: https://neon.tech
- **Vantagens**: Serverless PostgreSQL, auto-scaling, free tier generoso
- **Configuração**:
  ```bash
  DATABASE_URL=postgresql://usuario:senha@ep-nome-projeto.neon.tech/safemoney?sslmode=require
  ```

#### Opção 2: Supabase
- **URL**: https://supabase.com
- **Vantagens**: PostgreSQL com recursos adicionais, interface amigável
- **Configuração**:
  ```bash
  DATABASE_URL=postgresql://postgres:senha@db.projeto.supabase.co:5432/postgres
  ```

#### Opção 3: PlanetScale
- **URL**: https://planetscale.com
- **Vantagens**: MySQL compatível, branching de schema
- **Nota**: Requer ajuste no schema para MySQL

### 3. Configuração no Painel Vercel

#### Passo 1: Acessar Environment Variables
1. Entre no painel Vercel
2. Selecione seu projeto SafeMoney
3. Vá em "Settings" → "Environment Variables"

#### Passo 2: Adicionar Variáveis
Para cada ambiente (Production, Preview, Development):

```bash
# Variável principal
DATABASE_URL = sua_string_de_conexao_completa

# Variáveis de backup (opcional)
PGHOST = host_do_banco
PGUSER = usuario_do_banco
PGPASSWORD = senha_do_banco
PGDATABASE = nome_do_banco
PGPORT = 5432
NODE_ENV = production
```

### 4. Comandos para Deploy

#### Deploy Manual
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Deploy Automático (GitHub)
1. Conecte repositório no Vercel
2. Configure variáveis de ambiente
3. Push para main = deploy automático

### 5. Validação da Configuração

#### Teste Local
```bash
# Baixar variáveis de ambiente
vercel env pull

# Testar localmente
vercel dev
```

#### Logs de Produção
```bash
# Ver logs em tempo real
vercel logs --follow
```

### 6. Troubleshooting Comum

#### Erro de Conexão SSL
```bash
# Adicionar parâmetro SSL na string de conexão
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

#### Timeout de Conexão
```bash
# Aumentar timeout na configuração (já configurado para 30s)
"maxDuration": 30
```

#### Variáveis Não Encontradas
```bash
# Verificar se todas as variáveis estão definidas para o ambiente correto
# Production = branch main
# Preview = outras branches
```

## Schema do Banco de Dados

### Migrations Automáticas
O SafeMoney usa Drizzle ORM que aplicará automaticamente:

```sql
-- Tabelas principais
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  balance DECIMAL(10,2) DEFAULT 289.00,
  daily_evaluations_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  min_earning DECIMAL(10,2),
  max_earning DECIMAL(10,2)
);

CREATE TABLE evaluations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  stage INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE,
  answers JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2),
  type VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  stage INTEGER,
  question_text TEXT,
  question_type VARCHAR(50),
  options JSONB
);
```

### Dados Iniciais
O sistema criará automaticamente produtos de exemplo e questões de avaliação.

## Checklist de Deploy

- [ ] Banco de dados PostgreSQL configurado (Neon/Supabase)
- [ ] Variáveis de ambiente definidas no Vercel
- [ ] Build testado localmente (`npm run build`)
- [ ] Deploy realizado (`vercel --prod`)
- [ ] Teste de conectividade com banco
- [ ] Validação das funcionalidades principais
- [ ] Configuração de domínio personalizado (opcional)

## Suporte e Manutenção

### Monitoramento
- Logs do Vercel para erros de aplicação
- Métricas do banco para performance
- Alertas de limite de usage

### Backup
- Backup automático do provedor (Neon/Supabase)
- Export manual periódico dos dados
- Versionamento do schema via migrations

---

**Resumo**: Configure DATABASE_URL no Vercel com sua string de conexão PostgreSQL. O resto é automático.