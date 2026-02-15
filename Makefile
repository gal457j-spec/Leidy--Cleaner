.PHONY: help install start stop dev docker docker-stop logs clean

help:
	@echo "🚀 AVAN-O Command Reference"
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start frontend + backend (single terminal)"
	@echo "  make dev-pm2      - Start with PM2 (recommended)"
	@echo "  make dev-docker   - Start with Docker Compose"
	@echo ""
	@echo "Production:"
	@echo "  make start        - Start all services"
	@echo "  make stop         - Stop all services"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run backend tests"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo ""
	@echo "Maintenance:"
	@echo "  make logs         - Tail all logs"
	@echo "  make clean        - Clean cache and node_modules"
	@echo "  make db-reset     - Reset database"

# ========== INSTALL ==========
install:
	@echo "📦 Installing dependencies..."
	npm install
	cd backend && npm install && cd ..
	cd frontend && npm install && cd ..
	@echo "✅ Done"

# ========== DEVELOPMENT ==========
dev:
	@echo "🚀 Starting AVAN-O (All Services in 1 Command)"
	bash dev.sh

dev-pm2:
	@echo "🚀 Starting with PM2..."
	npm install -g pm2 2>/dev/null || true
	pm2 start ecosystem.dev.config.js
	@echo ""
	@echo "✅ Services started:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"
	@echo ""
	@echo "View logs: pm2 logs"
	@echo "Stop all: pm2 stop all"

dev-docker:
	@echo "🐳 Starting with Docker Compose..."
	docker-compose -f docker-compose.dev.yml up
	@echo ""
	@echo "✅ Services started:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"

# ========== PRODUCTION ==========
start:
	@echo "🚀 Starting Production Services..."
	cd backend && npm start &
	sleep 3
	cd frontend && npm run start &
	@echo "✅ Services running"

stop:
	@echo "🛑 Stopping services..."
	pkill -f "node src/index.js" 2>/dev/null || true
	pkill -f "next-server" 2>/dev/null || true
	pm2 stop all 2>/dev/null || true
	@echo "✅ Stopped"

# ========== TESTING ==========
test:
	@echo "🧪 Running tests..."
	cd backend && npm test

test-watch:
	@echo "🧪 Running tests (watch mode)..."
	cd backend && npm run test:watch

# ========== MAINTENANCE ==========
logs:
	@echo "📋 Backend logs:"
	tail -f /tmp/backend.log &
	@echo "📋 Frontend logs:"
	tail -f /tmp/frontend.log

clean:
	@echo "🧹 Cleaning..."
	rm -rf backend/node_modules backend/.next
	rm -rf frontend/node_modules frontend/.next
	rm -rf node_modules
	@echo "✅ Cleaned"

db-reset:
	@echo "🔄 Resetting database..."
	rm -f backend/backend_data/database.sqlite
	cd backend && node src/db/runMigrations.js
	@echo "✅ Database reset"

docker-stop:
	@echo "🛑 Stopping Docker containers..."
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Stopped"
