.PHONY: setup dev build test clean

setup:
	./scripts/setup.sh

dev:
	docker compose up -d db redis
	@echo "Starting backend..."
	cd backend && uvicorn app.main:app --reload --port 8000 &
	@echo "Starting frontend..."
	cd frontend && npm run dev &

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

test:
	cd backend && python -m pytest tests/ -v

lint:
	cd backend && python -m ruff check .
	cd frontend && npm run lint

clean:
	docker compose down -v
	rm -rf backend/__pycache__ backend/.pytest_cache
	rm -rf frontend/.next frontend/node_modules
