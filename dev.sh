#!/bin/bash

# ============================================
# AVAN-O: Start All Services (1 Command)
# ============================================

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Starting AVAN-O (All Services)..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Kill any existing processes
pkill -f "node src/index.js" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
sleep 1

# Start Backend
echo -e "${BLUE}→ Backend${NC} (port 3001)..."
cd "$PROJECT_ROOT/backend"
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "  PID: $BACKEND_PID"

# Start Frontend
echo -e "${BLUE}→ Frontend${NC} (port 3000)..."
cd "$PROJECT_ROOT/frontend"
npm run start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "  PID: $FRONTEND_PID"

echo ""
echo -e "${GREEN}✅ AVAN-O Started!${NC}"
echo ""
echo "📱 Access:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""
echo "📋 Logs:"
echo "  tail -f /tmp/backend.log"
echo "  tail -f /tmp/frontend.log"
echo ""
echo "🛑 To Stop:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  # or: pkill -f 'node src/index.js'; pkill -f next-server"
echo ""

# Keep script running
wait
