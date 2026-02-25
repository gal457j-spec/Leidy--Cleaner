#!/bin/bash

echo "🧹 Iniciando limpeza do projeto Leidy Cleaner..."

# Remover arquivos de build e cache
echo "📁 Removendo arquivos de build e cache..."
rm -rf frontend/.next
rm -rf frontend/test-output.css
rm -rf frontend/jest-results.json
rm -rf frontend/tsconfig.tsbuildinfo
rm -rf backend/dist

# Remover arquivos temporários
echo "🗑️  Removendo arquivos temporários..."
find . -name "*.log" -type f -delete 2>/dev/null
find . -name "*.tmp" -type f -delete 2>/dev/null
find . -name "*.bak" -type f -delete 2>/dev/null
find . -name "*~" -type f -delete 2>/dev/null
find . -name ".DS_Store" -type f -delete 2>/dev/null

# Verificar vulnerabilidades
echo "🔒 Verificando vulnerabilidades..."
cd frontend && npm audit --audit-level=high > ../security-audit-frontend.txt 2>&1
cd ../backend && npm audit --audit-level=high > ../security-audit-backend.txt 2>&1
cd ..

# Verificar dependências não utilizadas
echo "📦 Verificando dependências não utilizadas..."
cd frontend && npx depcheck --json > ../unused-deps-frontend.json 2>/dev/null || echo "depcheck falhou no frontend"
cd ../backend && npx depcheck --json > ../unused-deps-backend.json 2>/dev/null || echo "depcheck falhou no backend"
cd ..

echo "✅ Limpeza concluída!"
echo "📊 Relatórios gerados:"
echo "   - security-audit-frontend.txt"
echo "   - security-audit-backend.txt" 
echo "   - unused-deps-frontend.json"
echo "   - unused-deps-backend.json"
