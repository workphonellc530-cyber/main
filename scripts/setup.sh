#!/bin/bash
set -e

echo "========================================="
echo "  AgentForge AI - Setup Script"
echo "========================================="
echo ""

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Install from https://docker.com"; exit 1; }
command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required."; exit 1; }

# Create env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    SECRET_KEY=$(openssl rand -hex 64 2>/dev/null || python3 -c "import secrets; print(secrets.token_hex(64))")
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/generate-with-openssl-rand-hex-64/$SECRET_KEY/" backend/.env
    else
        sed -i "s/generate-with-openssl-rand-hex-64/$SECRET_KEY/" backend/.env
    fi
    echo "  -> Created backend/.env (update with your API keys)"
fi

if [ ! -f frontend/.env ]; then
    echo "Creating frontend/.env from template..."
    cp frontend/.env.example frontend/.env
    echo "  -> Created frontend/.env"
fi

echo ""
echo "Starting services..."
docker compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 5

echo ""
echo "========================================="
echo "  AgentForge AI is running!"
echo "========================================="
echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo "  Database:  localhost:5432"
echo ""
echo "  Next steps:"
echo "  1. Add your OpenAI/Anthropic API key to backend/.env"
echo "  2. Add your Stripe keys to backend/.env"
echo "  3. Run: docker compose restart backend"
echo ""
