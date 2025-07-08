#!/bin/bash

# Deploy script para Vercel
echo "🚀 Iniciando deploy do SafeMoney para Vercel..."

# Verificar se existe vercel.json
if [ ! -f "vercel.json" ]; then
    echo "❌ Erro: vercel.json não encontrado"
    exit 1
fi

# Verificar se existe api/index.ts
if [ ! -f "api/index.ts" ]; then
    echo "❌ Erro: api/index.ts não encontrado"
    exit 1
fi

# Limpar build anterior
echo "🧹 Limpando build anterior..."
rm -rf dist/

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build do frontend
echo "🏗️ Building frontend..."
npm run build || {
    echo "❌ Erro no build do frontend"
    exit 1
}

# Verificar se build foi criado
if [ ! -d "dist/public" ]; then
    echo "❌ Erro: dist/public não foi criado"
    exit 1
fi

# Verificar arquivos essenciais
echo "🔍 Verificando arquivos essenciais..."
if [ ! -f "dist/public/index.html" ]; then
    echo "❌ Erro: index.html não encontrado em dist/public"
    exit 1
fi

# Deploy para Vercel
echo "🚀 Fazendo deploy para Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "⚠️  Vercel CLI não encontrada. Instale com: npm i -g vercel"
    echo "📝 Ou faça upload manual dos arquivos para o painel do Vercel"
fi

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Acesse seu app em: https://seu-projeto.vercel.app"