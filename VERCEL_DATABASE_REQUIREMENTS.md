# Requisitos do Vercel para Banco de Dados - SafeMoney

## Análise dos Requisitos Vercel

Baseado na documentação oficial do Vercel, aqui estão os requisitos e configurações necessárias:

### Limites de Variáveis de Ambiente
- **Total combinado**: 64 KB para todas as variáveis
- **Por variável individual**: Máximo 64 KB cada
- **Edge Functions**: Limitado a 5 KB (não aplicável ao SafeMoney)

### Ambientes Disponíveis
- **Production**: Deploy da branch main (`vercel --prod`)
- **Preview**: Deploys de outras branches
- **Development**: Desenvolvimento local (`vercel dev`)

## O Que Você Precisa Fazer

### 1. Escolher Provedor de Banco PostgreSQL

#### Opção A: Neon (Recomendado)
- **URL**: https://neon.tech
- **Por que usar**: Serverless, auto-scaling, free tier generoso
- **Como configurar**:
  1. Criar conta no Neon
  2. Criar novo projeto
  3. Copiar connection string

#### Opção B: Supabase
- **URL**: https://supabase.com  
- **Por que usar**: Interface visual, recursos extras
- **Como configurar**:
  1. Criar conta no Supabase
  2. Criar novo projeto
  3. Ir em Settings → Database
  4. Copiar connection string

#### Opção C: Railway
- **URL**: https://railway.app
- **Por que usar**: Simples, PostgreSQL dedicado
- **Como configurar**:
  1. Criar conta no Railway
  2. Deploy PostgreSQL template
  3. Copiar connection string

### 2. Configurar Variáveis no Vercel

#### Passo a Passo:
1. **Acesse**: https://vercel.com/dashboard
2. **Selecione**: Seu projeto SafeMoney
3. **Vá em**: Settings → Environment Variables
4. **Adicione a variável**:
   - Nome: `DATABASE_URL`
   - Valor: `postgresql://usuario:senha@host:porta/database?sslmode=require`
   - Ambientes: ✅ Production, ✅ Preview, ✅ Development

#### Exemplo de String de Conexão:
```bash
# Neon
DATABASE_URL=postgresql://usuario:senha@ep-projeto-123.neon.tech/safemoney?sslmode=require

# Supabase  
DATABASE_URL=postgresql://postgres:senha@db.projeto.supabase.co:5432/postgres

# Railway
DATABASE_URL=postgresql://postgres:senha@containers-us-west-1.railway.app:5432/railway
```

### 3. Verificar Configuração

#### Teste Local:
```bash
# Baixar variáveis do Vercel
vercel env pull

# Verificar se DATABASE_URL existe
cat .env | grep DATABASE_URL

# Testar aplicação localmente
vercel dev
```

#### Health Check:
Após deploy, acesse: `https://seu-projeto.vercel.app/api/health`

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-07-08T08:00:00.000Z", 
  "database": "configured"
}
```

### 4. Deploy para Vercel

#### Via CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Via GitHub:
1. Conectar repositório no painel Vercel
2. Configurar variável `DATABASE_URL`
3. Push para main = deploy automático

## Funcionalidades Automatizadas

### Schema do Banco
O SafeMoney criará automaticamente:
- Tabelas: users, products, evaluations, transactions, questions
- Índices necessários para performance
- Dados iniciais (produtos de exemplo, questões)

### Migrations
O Drizzle ORM aplicará automaticamente:
- Schema inicial na primeira execução
- Atualizações futuras via `npm run db:push`

### Backup e Segurança
- SSL obrigatório (sslmode=require)
- Conexões criptografadas
- Backup automático pelo provedor

## Troubleshooting

### Erro "DATABASE_URL not found"
✅ **Solução**: Adicionar variável no painel Vercel

### Erro "SSL connection required"
✅ **Solução**: Adicionar `?sslmode=require` na string de conexão

### Erro "Connection timeout"
✅ **Solução**: Verificar se IP do Vercel está whitelistado no provedor

### Erro "Table doesn't exist"
✅ **Solução**: Executar `npm run db:push` para criar schema

## Custos Estimados

### Neon (Recomendado)
- **Free tier**: 0.5 GB storage, 100 horas compute
- **Pro**: $19/mês para uso moderado
- **Escala**: Automático baseado no uso

### Supabase
- **Free tier**: 500 MB storage, 2 GB transfer
- **Pro**: $25/mês para recursos completos
- **Escala**: Manual ou automático

### Railway
- **Free tier**: $5 crédito/mês
- **Pro**: $20/mês para uso dedicado
- **Escala**: Manual

## Checklist de Deploy

- [ ] Provedor PostgreSQL configurado
- [ ] DATABASE_URL adicionada no Vercel
- [ ] Variável aplicada aos 3 ambientes (Production, Preview, Development)
- [ ] Health check retornando "database": "configured"
- [ ] Deploy realizado com sucesso
- [ ] Funcionalidades testadas (registro, login, avaliações)
- [ ] Logs verificados no painel Vercel

## Próximos Passos

1. **Escolha um provedor** (recomendo Neon)
2. **Configure DATABASE_URL** no Vercel
3. **Faça deploy** com `vercel --prod`
4. **Teste a aplicação** em produção
5. **Configure domínio personalizado** (opcional)

---

**Resumo**: Você só precisa de uma variável `DATABASE_URL` no Vercel. O resto é automático.