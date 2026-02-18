#!/bin/bash

# Vammos Platform - Setup Local Developer Environment

set -e

echo "🚀 Vammos Platform - Local Setup"
echo "=================================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
command -v docker >/dev/null 2>&1 || { echo "❌ Docker not found. Please install Docker."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Please install Node.js 20+."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm not found."; exit 1; }

echo "✓ Prerequisites OK"
echo ""

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker run -d \
  --name vammos-postgres-test \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chega_test \
  -p 5432:5432 \
  postgres:15 \
  2>/dev/null || true

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 2
until docker exec vammos-postgres-test pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
done
echo "✓ PostgreSQL ready"
echo ""

# Backend setup
echo "🔧 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
  npm install
fi

echo "📋 Running migrations..."
DB_HOST=localhost \
DB_PORT=5432 \
DB_NAME=chega_test \
DB_USER=postgres \
DB_PASSWORD=postgres \
npm run migrate || true

echo "🌱 Seeding database..."
DB_HOST=localhost \
DB_PORT=5432 \
DB_NAME=chega_test \
DB_USER=postgres \
DB_PASSWORD=postgres \
npm run seed || true

echo "✓ Backend ready"
echo ""

# Frontend setup
echo "🎨 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
  npm install
fi

echo "✓ Frontend ready"
echo ""

# Summary
echo "=================================="
echo "✅ Setup Complete!"
echo ""
echo "Start Development:"
echo ""
echo "1️⃣ Backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo "   👉 http://localhost:3001"
echo ""
echo "2️⃣ Frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo "   👉 http://localhost:3000"
echo ""
echo "3️⃣ Run Tests (Terminal 3):"
echo "   cd backend && npm test"
echo ""
echo "Test Credentials:"
echo "  Email: admin@vammos.com"
echo "  Password: admin123456"
echo ""
echo "API Documentation:"
echo "  Health: GET http://localhost:3001/health"
echo "  Status: GET http://localhost:3001/api/v1/status"
echo "  Docs: See backend/README.md"
echo ""
echo "Next: Login at http://localhost:3000 and explore!"
echo "=================================="
