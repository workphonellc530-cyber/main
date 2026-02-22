## AgentOps Revenue Engine

This repo is a **deployable AI-agent console** you can sell as a **high-ticket automation**: run opinionated playbooks (lead qualification, support replies, proposal writing), store every run for an audit trail, and optionally **charge via Stripe**.

**Important**: There is **no guaranteed way** to make $200,000 in 14 days. The fastest plausible path is a **high-ticket offer** with tight scope + aggressive distribution. This repo gives you a working product + a concrete GTM plan.

### Quick start

- **Run the app**:

```bash
cd agentops
npm install
npx prisma migrate dev
npm run dev
```

- **Minimum env to run playbooks** (create `agentops/.env`):
  - `DATABASE_URL="file:./dev.db"`
  - `SESSION_SECRET="(32+ chars)"`
  - `OPENAI_API_KEY="..."`

### What you can sell (recommended)

- **Offer name**: “Revenue Response System”
- **Outcome**: Faster lead response + better qualification + fewer support escalations
- **Deliverables (7 days)**:
  - Deploy your branded console (this app)
  - Configure 3 playbooks to their niche + tone
  - Connect to their inbox/helpdesk (Phase 2; you can start manually with copy/paste)
  - Weekly improvement based on run history (proof of ROI)

### How $200k in 14 days is *plausible*

Pick **one** of these math paths (you still have to sell it):

- **10 clients × $20k setup** = $200k
- **20 clients × $10k setup** = $200k
- **8 clients × $15k setup + $1.25k first-month** ≈ $130k + upsells

Your fastest lever is **setup fees** (cash now), then retainers later.

### 14-day GTM plan (do this like a sprint)

- The detailed day-by-day sprint doc is in `docs/14-day-gtm.md`.

- **Day 1–2**: Pick a niche + pain + promise
  - Example niches: agencies, B2B SaaS, clinics, local services, Shopify brands
  - One sentence: “We reduce lead-response time to <5 minutes and raise booked calls using an AI qualification agent + audit trail.”
- **Day 3**: Create a 5-minute demo
  - Show: lead message → playbook output → “run history” proof → billing page
- **Day 4–6**: Outbound + referrals (volume wins)
  - Goal: 100–200 targeted messages/day across email + LinkedIn
  - Ask for **15-minute “diagnostic” calls**
- **Day 7–10**: Close “pilot” setups (limited slots)
  - Sell a **7-day implementation** with a clear deliverable list
  - Collect setup fee upfront (Stripe or invoice)
- **Day 11–14**: Deliver fast, publish proof, upsell
  - Use run history screenshots (with permission) as proof
  - Convert pilots to retainers + referrals

### Simple outreach script (email/DM)

Subject: `{{first}} — quick question about your lead response`

Body:
> Hey {{first}} — noticed you’re running {{channel}}.  
> If I could help you **increase booked calls** by responding/qualifying new leads in <5 minutes (without adding headcount), would you want to see a 5‑minute demo?  
> If yes, what’s your weekly lead volume and what’s your current “time-to-first-response”?

### Where the app lives

- The actual Next.js app is in `agentops/`. Start there.

