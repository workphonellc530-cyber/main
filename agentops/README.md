## AgentOps (app)

This is the **AI-agent console** (Next.js App Router) with:

- **Auth + orgs**: signup/login, org membership, sessions
- **Playbooks**: lead qualifier, support autoresponder, proposal writer
- **Audit trail**: every run stored (input/output/status)
- **Stripe**: checkout + customer portal + webhook sync
- **Plan gating**: Free tier capped at **10 successful runs**

### Local development

```bash
npm install
npx prisma migrate dev
npm run dev
```

Then open `http://localhost:3000`.

### Environment variables

Create `.env` (example values):

```bash
# Database (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# Sessions (required in production; 32+ chars)
SESSION_SECRET="change_me_change_me_change_me_change_me_change_me"

# App URL (used for Stripe redirects)
APP_URL="http://localhost:3000"

# LLM (required to run playbooks)
OPENAI_API_KEY="..."
OPENAI_MODEL="gpt-4o-mini"

# Stripe (optional, required to charge)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Stripe setup

- **Create a recurring Price** in Stripe and set `STRIPE_PRICE_ID`
- **Add a webhook endpoint** to:
  - `POST /api/stripe/webhook`
- **Listen to events**:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### Notes for production

- SQLite is great for a single-node deployment; for multi-instance SaaS, move to Postgres.
- Always set `SESSION_SECRET` in production.

### Docker

```bash
docker compose -f compose.yml up --build
```

