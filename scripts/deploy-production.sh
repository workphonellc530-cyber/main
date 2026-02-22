#!/bin/bash
set -e

echo "========================================="
echo "  AgentForge AI - Production Deployment"
echo "========================================="
echo ""

ENV=${1:-production}

echo "Deploying to: $ENV"
echo ""

# Build images
echo "Building Docker images..."
docker compose -f docker-compose.yml build --no-cache

# Tag and push (configure your registry)
REGISTRY=${DOCKER_REGISTRY:-"your-registry.com/agentforge"}
VERSION=$(git describe --tags --always 2>/dev/null || echo "latest")

echo "Tagging images as $REGISTRY:$VERSION..."
docker tag agentforge-backend:latest $REGISTRY/backend:$VERSION
docker tag agentforge-frontend:latest $REGISTRY/frontend:$VERSION

echo "Pushing images..."
docker push $REGISTRY/backend:$VERSION
docker push $REGISTRY/frontend:$VERSION

echo ""
echo "Images pushed. Deploy to your orchestrator:"
echo "  - ECS: aws ecs update-service --cluster agentforge --service backend --force-new-deployment"
echo "  - K8s: kubectl set image deployment/backend backend=$REGISTRY/backend:$VERSION"
echo "  - Cloud Run: gcloud run deploy backend --image $REGISTRY/backend:$VERSION"
echo ""
echo "Production deployment complete!"
