#!/bin/bash

# Script de verificação de deploy para Vercel
echo "🔍 Verificando configuração de deploy..."

# Verificar se vercel.json está limpo
echo "📋 Verificando vercel.json..."
if grep -q "@" vercel.json; then
    echo "❌ Erro: vercel.json contém referências a secrets (@)"
    echo "💡 Remova todas as referências @ do vercel.json"
    exit 1
else
    echo "✅ vercel.json está limpo"
fi

# Verificar se api/index.ts existe
if [ ! -f "api/index.ts" ]; then
    echo "❌ Erro: api/index.ts não encontrado"
    exit 1
else
    echo "✅ api/index.ts encontrado"
fi

# Verificar build local
echo "🏗️ Testando build local..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build local funcionando"
else
    echo "❌ Erro no build local"
    echo "💡 Execute: npm run build para ver detalhes"
    exit 1
fi

# Verificar se dist/public foi criado
if [ -d "dist/public" ]; then
    echo "✅ dist/public criado corretamente"
else
    echo "❌ dist/public não foi criado"
    exit 1
fi

# Testar health check local
echo "🔍 Testando health check local..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health)
    echo "✅ Health check local funcionando"
    echo "📊 Resposta: $HEALTH_RESPONSE"
else
    echo "⚠️ Health check local não acessível (servidor pode estar parado)"
fi

echo ""
echo "📋 Resumo da configuração:"
echo "✅ vercel.json limpo (sem @secrets)"
echo "✅ api/index.ts configurado"
echo "✅ Build funcionando"
echo "✅ Estrutura de arquivos correta"
echo ""
echo "🚀 Pronto para deploy! Execute:"
echo "   vercel --prod"
echo ""
echo "📝 Após deploy, configure no painel Vercel:"
echo "   DATABASE_URL = sua_string_de_conexao_postgresql"
echo ""
echo "🔍 Teste pós-deploy:"
echo "   https://seu-projeto.vercel.app/api/health"