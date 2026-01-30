#!/bin/bash
# 📋 Script de Validação - LimpezaPro

echo "🔍 VALIDANDO ESTRUTURA DO PROJETO LIMPEZAPRO..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
total_files=0
verified_files=0

# Função para verificar arquivo
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        ((verified_files++))
        ((total_files++))
    else
        echo -e "${RED}✗${NC} $description"
        ((total_files++))
    fi
}

# Função para verificar pasta
check_dir() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description"
        ((verified_files++))
        ((total_files++))
    else
        echo -e "${RED}✗${NC} $description"
        ((total_files++))
    fi
}

echo "📂 VERIFICANDO ESTRUTURA DE PASTAS..."
echo ""

check_dir "frontend" "Frontend (Next.js)"
check_dir "backend" "Backend (Express)"
check_dir "automation" "Automações"
check_dir "database" "Banco de Dados"
check_dir "config" "Configurações"
check_dir "docs" "Documentação"

echo ""
echo "📄 VERIFICANDO COMPONENTES FRONTEND..."
echo ""

check_file "frontend/src/components/Layout/Header.jsx" "  Header component"
check_file "frontend/src/components/Layout/Footer.jsx" "  Footer component"
check_file "frontend/src/components/Scheduling/CalendarPicker.jsx" "  Calendar picker"
check_file "frontend/src/components/Scheduling/ServiceSelector.jsx" "  Service selector"
check_file "frontend/src/components/Scheduling/PriceCalculator.jsx" "  Price calculator"
check_file "frontend/src/pages/index.jsx" "  Home page"
check_file "frontend/src/pages/agendar.jsx" "  Booking page"
check_file "frontend/package.json" "  Frontend package.json"

echo ""
echo "⚙️  VERIFICANDO BACKEND..."
echo ""

check_file "backend/src/controllers/BookingController.js" "  Booking controller"
check_file "backend/src/controllers/PaymentController.js" "  Payment controller"
check_file "backend/src/services/BookingService.js" "  Booking service"
check_file "backend/src/services/PricingService.js" "  Pricing service"
check_file "backend/src/services/AutomationService.js" "  Automation service"
check_file "backend/src/middleware/auth.js" "  Auth middleware"
check_file "backend/src/routes/api.js" "  API routes"
check_file "backend/src/index.js" "  Server entry point"
check_file "backend/package.json" "  Backend package.json"

echo ""
echo "🤖 VERIFICANDO AUTOMAÇÕES..."
echo ""

check_file "automation/chatbot/ChatbotService.js" "  Chatbot service"
check_file "automation/chatbot/intents.json" "  Chatbot intents"
check_file "automation/integrations/GoogleCalendarSync.js" "  Google Calendar sync"
check_file "automation/integrations/WhatsAppService.js" "  WhatsApp service"
check_file "automation/automation-rules.js" "  Automation rules"
check_file "automation/pricing-matrix.json" "  Pricing matrix"

echo ""
echo "🗄️  VERIFICANDO BANCO DE DADOS..."
echo ""

check_file "database/schema.sql" "  Database schema"
check_file "database/migrations/001_initial_tables.sql" "  Migration 1"
check_file "database/migrations/002_add_payments.sql" "  Migration 2"
check_file "database/migrations/003_add_automation.sql" "  Migration 3"
check_file "database/seeds/services_data.sql" "  Services seed"
check_file "database/queries/analytics_queries.sql" "  Analytics queries"

echo ""
echo "🐳 VERIFICANDO DOCKER & CONFIGURAÇÃO..."
echo ""

check_file "config/docker/docker-compose.yml" "  Docker Compose"
check_file "config/docker/Dockerfile.frontend" "  Frontend Dockerfile"
check_file "config/docker/Dockerfile.backend" "  Backend Dockerfile"
check_file "config/nginx/nginx.conf" "  Nginx config"
check_file "config/env/.env.development" "  Development env"
check_file "config/env/.env.staging" "  Staging env"
check_file "config/ci-cd/github-actions.yml" "  GitHub Actions"

echo ""
echo "📚 VERIFICANDO DOCUMENTAÇÃO..."
echo ""

check_file "docs/API.md" "  API Documentation"
check_file "docs/WORKFLOWS.md" "  Workflows Documentation"
check_file "docs/INTEGRATIONS.md" "  Integrations Guide"
check_file "docs/EMERGENCY.md" "  Emergency Procedures"
check_file "README.md" "  README"
check_file "SUMARIO.md" "  Sumário Executivo"
check_file "GUIA_VISUAL.md" "  Guia Visual"

echo ""
echo "════════════════════════════════════════════════════"
echo ""
echo "📊 RESULTADO DA VALIDAÇÃO"
echo ""
echo -e "Arquivos/pastas verificados: ${YELLOW}$verified_files${NC}/${total_files}"

percentage=$((verified_files * 100 / total_files))
echo -e "Percentual de conclusão: ${YELLOW}${percentage}%${NC}"

echo ""

if [ $percentage -eq 100 ]; then
    echo -e "${GREEN}✓ ESTRUTURA COMPLETA E VALIDADA!${NC}"
    echo ""
    echo "🎉 Seu projeto LimpezaPro está 100% pronto!"
    echo ""
    echo "Próximos passos:"
    echo "  1. Instalar dependências:"
    echo "     • cd frontend && npm install"
    echo "     • cd ../backend && npm install"
    echo ""
    echo "  2. Configurar variáveis de ambiente:"
    echo "     • cp config/env/.env.development .env"
    echo "     • Editar com suas chaves de API"
    echo ""
    echo "  3. Iniciar com Docker:"
    echo "     • docker-compose up -d"
    echo ""
    echo "  4. Acessar:"
    echo "     • Frontend: http://localhost:3000"
    echo "     • Backend: http://localhost:3001"
    echo ""
else
    echo -e "${RED}⚠️  ALGUNS ARQUIVOS FALTAM (${percentage}%)${NC}"
    echo "Verifique os arquivos marcados com ✗"
fi

echo ""
echo "════════════════════════════════════════════════════"
