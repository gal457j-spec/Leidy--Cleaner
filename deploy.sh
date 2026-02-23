#!/bin/bash
set -e

echo "🚀 Leidy Cleaner - Production Docker Deployment"
echo "================================================"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"

# Build
echo ""
echo "📦 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start
echo ""
echo "🔧 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Health checks
echo ""
echo "🏥 Checking service health..."

echo -n "Nginx: "
if curl -s http://localhost/health > /dev/null 2>&1; then
    echo "✅"
else
    echo "❌"
fi

echo -n "API: "
if curl -s http://localhost/api/v1/health > /dev/null 2>&1; then
    echo "✅"
else
    echo "❌"
fi

echo -n "Frontend: "
if curl -s http://localhost/ > /dev/null 2>&1; then
    echo "✅"
else
    echo "❌"
fi

# Summary
echo ""
echo "✨ Deployment Complete!"
echo ""
echo "📍 Access:"
echo "   🌐 http://localhost"
echo ""
echo "📊 Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📋 Useful commands:"
echo "   docker-compose -f docker-compose.prod.yml logs -f nginx"
echo "   docker-compose -f docker-compose.prod.yml logs -f api"
echo "   docker-compose -f docker-compose.prod.yml logs -f web"
echo "   docker-compose -f docker-compose.prod.yml down"
