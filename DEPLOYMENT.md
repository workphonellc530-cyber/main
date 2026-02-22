# ProfitAI Platform - Deployment Guide

## Quick Deploy (5 Minutes)

### Option A: Local Development

```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

### Option B: Docker

```bash
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Production Deployment

### Frontend (Vercel - Recommended)

1. Push to GitHub
2. Import project at vercel.com
3. Set root directory: `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-api-url.com`
5. Deploy

### Backend (Railway / Render / Fly.io)

**Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```

**Render:** Create Web Service, connect repo, set:
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL recommended for production
- `OPENAI_API_KEY` - For AI agent execution
- `ANTHROPIC_API_KEY` - Alternative LLM
- `STRIPE_SECRET_KEY` - For payments

### Database (Production)

Replace SQLite with PostgreSQL:
```
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/profitai
```

Update requirements.txt:
```
asyncpg==0.29.0
```

---

## API Endpoints Summary

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/agents/templates` | List agent types & pricing |
| `POST /api/v1/agents/execute` | Run agent (lead gen, qualify, etc.) |
| `GET /api/v1/agents/prebuilt` | Pre-built deployable agents |
| `GET /api/v1/marketplace/agents` | Browse marketplace |
| `POST /api/v1/marketplace/purchase` | Buy agent (25% commission) |
| `GET /api/v1/leads/revenue-metrics` | Dashboard metrics |
| `POST /api/v1/api-keys` | Create enterprise API key |

---

## Revenue Launch Checklist

- [ ] Deploy to production
- [ ] Configure Stripe (subscriptions + marketplace)
- [ ] Add OpenAI/Anthropic API keys
- [ ] Set up Calendly for demo booking
- [ ] Create enterprise lead list (50 accounts)
- [ ] Draft outbound email sequence
- [ ] Prepare demo script
- [ ] Launch Product Hunt / Twitter

---

## Support

For enterprise deployment assistance, contact: enterprise@profitai.com
