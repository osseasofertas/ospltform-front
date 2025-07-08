# Correção de Erros de Deploy no Vercel - SafeMoney

## Problema Identificado

O erro `Environment Variable 'DATABASE_URL' references Secret 'database_url', which does not exist` ocorre porque:

1. O `vercel.json` estava referenciando secrets com `@database_url` que não existem
2. O Vercel esperava encontrar secrets criados no Secrets Manager
3. A configuração estava misturando variáveis de ambiente com secrets

## Soluções Aplicadas

### 1. Removido Referências a Secrets Inexistentes
- Removido seção `"env"` do `vercel.json` que causava o erro
- Configuração agora usa apenas Environment Variables do painel

### 2. Vercel.json Simplificado
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "vite build",
  "outputDirectory": "dist/public",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.ts" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/index.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

### 3. API Otimizada para Vercel
- Adicionado health check em `/api/health`
- Melhorado tratamento de erros de inicialização
- CORS configurado corretamente para Vercel
- Verificação de DATABASE_URL com mensagens claras

## Como Configurar Agora

### Passo 1: Limpar Deploy Anterior
```bash
# Se necessário, limpar secrets antigos
vercel secrets rm database_url

# Limpar variáveis problemáticas
vercel env rm DATABASE_URL --yes
```

### Passo 2: Configurar Variável de Ambiente
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto SafeMoney
3. Vá em: Settings → Environment Variables
4. Adicione:
   - **Name**: `DATABASE_URL`
   - **Value**: `sua_string_de_conexao_postgresql`
   - **Environments**: ✅ Production ✅ Preview ✅ Development

### Passo 3: Deploy Corrigido
```bash
# Deploy com configuração corrigida
vercel --prod
```

### Passo 4: Verificar Health Check
Acesse: `https://seu-projeto.vercel.app/api/health`

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-07-08T...",
  "database": "configured"
}
```

## Exemplos de DATABASE_URL

### Neon (Recomendado)
```
postgresql://username:password@ep-project-123.neon.tech/safemoney?sslmode=require
```

### Supabase
```
postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

### Railway
```
postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway
```

## Troubleshooting

### Se ainda der erro "Secret does not exist"
```bash
# Verificar se não há referências @secret no projeto
grep -r "@" vercel.json
grep -r "@" package.json

# Resultado deve estar limpo
```

### Se DATABASE_URL não for reconhecida
1. Verificar se variável foi salva no painel Vercel
2. Verificar se está aplicada ao ambiente correto (Production)
3. Fazer novo deploy após adicionar variável

### Se health check retornar "database": "missing"
1. Variável não foi configurada no Vercel
2. Variável tem nome incorreto (deve ser exato: `DATABASE_URL`)
3. Ambiente não foi selecionado corretamente

## Deploy Automático GitHub

Se usando integração GitHub:
1. Configure `DATABASE_URL` no painel Vercel
2. Push para branch main
3. Deploy automático executará com nova configuração

## Status da Correção

✅ vercel.json limpo sem referências a secrets
✅ api/index.ts otimizado para Vercel
✅ Health check implementado
✅ Documentação de troubleshooting criada
✅ Exemplos de DATABASE_URL por provedor

**Próximo passo**: Configure DATABASE_URL no painel Vercel e faça novo deploy.