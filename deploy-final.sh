#!/bin/bash

#################################################################################
#  LEIDY CLEANER - FULL PRODUCTION DEPLOYMENT SCRIPT
#################################################################################
#  Este script faz o deploy completo do projeto para produção
#  Inclui: Build, Migrations, Deploy, Health checks, Smoke tests
#################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_requirements() {
    print_header "Verificando Requisitos"
    
    # Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker não encontrado"
        exit 1
    fi
    print_success "Docker encontrado: $(docker --version)"
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não encontrado"
        exit 1
    fi
    print_success "Docker Compose encontrado: $(docker-compose --version)"
    
    # Node/npm
    if ! command -v npm &> /dev/null; then
        print_error "npm não encontrado"
        exit 1
    fi
    print_success "npm encontrado: $(npm --version)"
    
    # Git
    if ! command -v git &> /dev/null; then
        print_error "Git não encontrado"
        exit 1
    fi
    print_success "Git encontrado: $(git --version)"
}

build_backend() {
    print_header "Build Backend (TypeScript → JavaScript)"
    
    cd backend
    print_info "Installing dependencies..."
    npm ci --silent
    
    print_info "Type checking..."
    npm run build
    
    print_success "Backend compilado com sucesso"
    cd ..
}

build_frontend() {
    print_header "Build Frontend (Next.js)"
    
    cd frontend
    print_info "Installing dependencies..."
    npm ci --silent
    
    print_info "Building Next.js app..."
    npm run build
    
    print_success "Frontend compilado com sucesso"
    cd ..
}

build_docker_images() {
    print_header "Build Docker Images"
    
    print_info "Building images without cache..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    print_success "Docker images built com sucesso"
}

start_services() {
    print_header "Iniciando Serviços"
    
    print_info "Starting services with docker-compose..."
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Serviços iniciados"
    
    print_info "Aguardando serviços ficarem prontos..."
    sleep 5
}

run_migrations() {
    print_header "Database Migrations"
    
    print_info "Running migrations..."
    docker-compose -f docker-compose.prod.yml exec -T api npm run migrate
    
    print_success "Migrations executadas"
}

seed_database() {
    print_header "Database Seeding"
    
    print_info "Seeding initial data..."
    docker-compose -f docker-compose.prod.yml exec -T api npm run seed
    
    print_success "Database seeded com sucesso"
}

health_checks() {
    print_header "Health Checks"
    
    local max_attempts=10
    local attempt=1
    local nginx_healthy=false
    local api_healthy=false
    
    while [ $attempt -le $max_attempts ] && ([ "$nginx_healthy" = false ] || [ "$api_healthy" = false ]); do
        if [ "$nginx_healthy" = false ]; then
            print_info "Checking Nginx health (attempt $attempt/$max_attempts)..."
            if curl -sf http://localhost/health > /dev/null 2>&1; then
                print_success "Nginx is healthy ✓"
                nginx_healthy=true
            fi
        fi
        
        if [ "$api_healthy" = false ]; then
            print_info "Checking API health (attempt $attempt/$max_attempts)..."
            if curl -sf http://localhost/api/v1/health > /dev/null 2>&1; then
                print_success "API is healthy ✓"
                api_healthy=true
            fi
        fi
        
        if [ "$nginx_healthy" = false ] || [ "$api_healthy" = false ]; then
            if [ $attempt -lt $max_attempts ]; then
                sleep 3
            fi
        fi
        
        ((attempt++))
    done
    
    if [ "$nginx_healthy" = false ] || [ "$api_healthy" = false ]; then
        print_error "Health checks failed"
        echo ""
        print_info "Docker logs:"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
    
    print_success "Todos os serviços estão saudáveis"
}

smoke_tests() {
    print_header "Smoke Tests"
    
    # Test 1: Home page
    print_info "Testing home page..."
    if curl -sf http://localhost/ > /dev/null 2>&1; then
        print_success "Home page OK"
    else
        print_warning "Home page test failed"
    fi
    
    # Test 2: API status
    print_info "Testing API status endpoint..."
    status=$(curl -s http://localhost/api/v1/status | jq -r '.status // "error"')
    if [ "$status" = "ok" ]; then
        print_success "API status OK"
    else
        print_warning "API status check failed"
    fi
    
    # Test 3: Services list
    print_info "Testing services endpoint..."
    services_count=$(curl -s http://localhost/api/v1/services | jq '.data | length // 0')
    if [ "$services_count" -gt 0 ]; then
        print_success "Services loaded: $services_count items"
    else
        print_warning "Services endpoint returned 0 items"
    fi
    
    # Test 4: Company info
    print_info "Testing company endpoint..."
    company=$(curl -s http://localhost/api/v1/company | jq '.data.name // "null"')
    if [ "$company" != "null" ] && [ ! -z "$company" ]; then
        print_success "Company info loaded"
    else
        print_warning "Company info not available"
    fi
    
    # Test 5: Swagger docs
    print_info "Testing Swagger documentation..."
    if curl -sf http://localhost/api/v1/docs > /dev/null 2>&1; then
        print_success "Swagger docs available"
    else
        print_warning "Swagger docs not found"
    fi
}

show_urls() {
    print_header "Endpoints Disponíveis"
    
    echo -e "${GREEN}Frontend:${NC}"
    echo "  Home:           http://localhost"
    echo "  Services:       http://localhost/services"
    echo "  Dashboard:      http://localhost/dashboard"
    echo "  Admin:          http://localhost/admin"
    echo ""
    
    echo -e "${GREEN}API:${NC}"
    echo "  Health:         http://localhost/api/v1/health"
    echo "  Status:         http://localhost/api/v1/status"
    echo "  Services:       http://localhost/api/v1/services"
    echo "  Swagger Docs:   http://localhost/api/v1/docs"
    echo ""
    
    echo -e "${GREEN}Database:${NC}"
    echo "  Type:           SQLite"
    echo "  Location:       ./backend/data/data.db"
    echo ""
}

show_docker_commands() {
    print_header "Comandos Úteis Docker"
    
    echo "Visualizar logs em tempo real:"
    echo "  docker-compose -f docker-compose.prod.yml logs -f"
    echo ""
    
    echo "Parar serviços:"
    echo "  docker-compose -f docker-compose.prod.yml down"
    echo ""
    
    echo "Reiniciar serviços:"
    echo "  docker-compose -f docker-compose.prod.yml restart"
    echo ""
    
    echo "Executar migração manual:"
    echo "  docker-compose -f docker-compose.prod.yml exec api npm run migrate"
    echo ""
    
    echo "Fazer backup:"
    echo "  docker-compose -f docker-compose.prod.yml exec api npm run backup"
    echo ""
}

main() {
    print_header "LEIDY CLEANER - FULL PRODUCTION DEPLOYMENT"
    echo "Iniciando deploy em: $(date)"
    echo ""
    
    # Step 1: Check requirements
    check_requirements
    
    # Step 2: Build backend
    build_backend
    
    # Step 3: Build frontend
    build_frontend
    
    # Step 4: Build Docker images
    build_docker_images
    
    # Step 5: Start services
    start_services
    
    # Step 6: Run migrations
    run_migrations
    
    # Step 7: Seed database
    seed_database
    
    # Step 8: Health checks
    health_checks
    
    # Step 9: Smoke tests
    smoke_tests
    
    # Step 10: Show URLs
    show_urls
    
    # Step 11: Show Docker commands
    show_docker_commands
    
    print_header "✅ DEPLOYMENT CONCLUÍDO COM SUCESSO!"
    echo "Aplicação está rodando em http://localhost"
    echo "API disponível em http://localhost/api/v1"
    echo "Documentação em http://localhost/api/v1/docs"
    echo ""
    echo "Iniciado em: $(date)"
}

# Run main function
main
