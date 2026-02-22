import { z } from "zod";

export type WorkflowId = "lead-qualifier" | "support-autoresponder" | "proposal-writer";

export type WorkflowDefinition = {
  id: WorkflowId;
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
  exampleInput: unknown;
  system: string;
  buildPrompt: (input: any) => string;
};

const leadQualifierSchema = z.object({
  lead_message: z.string().min(1),
  your_offer: z
    .string()
    .min(1)
    .default("High-ticket automation with an AI agent console + playbooks"),
  calendar_link: z.string().url().optional(),
  qualification_questions: z
    .array(z.string().min(1))
    .default([
      "What outcome are you targeting in the next 30 days?",
      "What’s your current lead volume per week?",
      "Who is the buyer and what’s the decision timeline?",
      "What’s the budget range (or current spend) for this problem?",
    ]),
  tone: z
    .enum(["direct", "friendly", "executive"])
    .default("friendly")
    .optional(),
});

const supportSchema = z.object({
  customer_message: z.string().min(1),
  policy_snippets: z
    .array(z.string().min(1))
    .default([
      "Be concise and helpful.",
      "If you can’t verify an order, ask for order number + email used at checkout.",
      "Never request full credit card details.",
    ]),
  order_context: z
    .object({
      order_id: z.string().optional(),
      status: z.string().optional(),
      tracking_url: z.string().url().optional(),
      items: z.array(z.string()).optional(),
    })
    .optional(),
  brand_voice: z.string().default("Warm, fast, and accountable."),
});

const proposalSchema = z.object({
  client_name: z.string().min(1),
  project_brief: z.string().min(1),
  desired_outcome: z.string().min(1),
  timeline: z.string().min(1).default("2-4 weeks"),
  budget_range: z.string().min(1).default("$5k-$25k"),
  assumptions: z.array(z.string().min(1)).default([
    "Client provides access/credentials promptly.",
    "Scope changes are handled via change order.",
  ]),
});

export const workflows: WorkflowDefinition[] = [
  {
    id: "lead-qualifier",
    name: "Lead Qualifier (Book Calls)",
    description:
      "Turns inbound inquiries into a crisp qualification summary + reply that pushes to a booked call.",
    inputSchema: leadQualifierSchema,
    exampleInput: {
      lead_message:
        "Hey — we’re getting leads from ads but they don’t convert. Can you help improve our pipeline?",
      your_offer:
        "AI SDR + lead qualification + appointment-setting automation for agencies",
      calendar_link: "https://cal.com/yourname/intro",
      tone: "executive",
    },
    system:
      "You are a world-class B2B SDR and revenue operator. Your goal is to qualify fast, protect time, and move the lead to a scheduled call. Be ethical and do not fabricate facts.",
    buildPrompt: (input) => {
      const q = (input.qualification_questions || []).map((x: string) => `- ${x}`).join("\n");
      return [
        "INBOUND LEAD MESSAGE:",
        input.lead_message,
        "",
        "YOUR OFFER:",
        input.your_offer,
        "",
        input.calendar_link ? `CALENDAR LINK: ${input.calendar_link}\n` : "",
        "REQUIREMENTS:",
        "- Output in Markdown.",
        "- First: a 5-bullet qualification summary (what they want, current state, likely ICP, risks, missing info).",
        "- Second: a short reply message that asks 2-4 of the questions below and proposes a call.",
        "- Third: a one-line next action for the operator.",
        "",
        "QUALIFICATION QUESTION BANK:",
        q,
        "",
        "STYLE:",
        `- Tone: ${input.tone || "friendly"}`,
        "- Be specific, avoid fluff, use short sentences.",
      ].join("\n");
    },
  },
  {
    id: "support-autoresponder",
    name: "Support Autoresponder (Resolve Tickets)",
    description:
      "Drafts a high-quality support reply and tags the issue type with next steps.",
    inputSchema: supportSchema,
    exampleInput: {
      customer_message:
        "My package never arrived. Tracking says delivered but I don't have it.",
      order_context: { order_id: "A-10492", status: "Delivered" },
      brand_voice: "Friendly, concise, proactive.",
    },
    system:
      "You are a senior customer support agent. You are careful with customer data. You follow policy and avoid promising refunds/replacements unless policy allows it. Do not invent tracking updates.",
    buildPrompt: (input) => {
      const policies = (input.policy_snippets || []).map((x: string) => `- ${x}`).join("\n");
      return [
        "CUSTOMER MESSAGE:",
        input.customer_message,
        "",
        "ORDER CONTEXT (IF ANY):",
        JSON.stringify(input.order_context || {}, null, 2),
        "",
        "BRAND VOICE:",
        input.brand_voice,
        "",
        "POLICIES:",
        policies,
        "",
        "REQUIREMENTS:",
        "- Output in Markdown with sections:",
        "  1) Ticket tags (comma-separated)",
        "  2) Suggested internal actions (bullets)",
        "  3) Customer reply (ready to send)",
        "- Ask for order number/email if missing.",
        "- If delivered-but-not-received: suggest checking neighbors/secure locations and confirm address, then propose next step.",
      ].join("\n");
    },
  },
  {
    id: "proposal-writer",
    name: "Proposal Writer (Close Deals)",
    description:
      "Produces a client-ready proposal: scope, deliverables, timeline, risks, and pricing options.",
    inputSchema: proposalSchema,
    exampleInput: {
      client_name: "Acme Dental",
      project_brief:
        "Automate lead follow-up and rescheduling reminders via SMS + email, integrated with our CRM.",
      desired_outcome:
        "Increase booked appointments and reduce no-shows by 20% in 60 days.",
      timeline: "3 weeks",
      budget_range: "$8k-$18k",
    },
    system:
      "You are a sales engineer writing crisp proposals. You avoid legal claims and guarantee language. You are clear about assumptions, risks, and acceptance criteria.",
    buildPrompt: (input) => {
      const assumptions = (input.assumptions || []).map((x: string) => `- ${x}`).join("\n");
      return [
        `CLIENT: ${input.client_name}`,
        "",
        "PROJECT BRIEF:",
        input.project_brief,
        "",
        "DESIRED OUTCOME:",
        input.desired_outcome,
        "",
        `TIMELINE: ${input.timeline}`,
        `BUDGET RANGE: ${input.budget_range}`,
        "",
        "ASSUMPTIONS:",
        assumptions,
        "",
        "REQUIREMENTS:",
        "- Output in Markdown.",
        "- Include: Overview, Scope, Deliverables, Timeline, Success metrics, Risks, Assumptions, Pricing options (3 tiers), Next steps.",
        "- Keep it concrete and implementable.",
      ].join("\n");
    },
  },
];

export function getWorkflow(id: WorkflowId) {
  const wf = workflows.find((w) => w.id === id);
  if (!wf) throw new Error(`Unknown workflow: ${id}`);
  return wf;
}

