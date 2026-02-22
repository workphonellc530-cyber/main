import type { WorkflowId } from "@/lib/workflows";

export const workflowCatalog: Array<{
  id: WorkflowId;
  name: string;
  description: string;
  exampleInput: unknown;
}> = [
  {
    id: "lead-qualifier",
    name: "Lead Qualifier (Book Calls)",
    description:
      "Qualify inbound leads and draft a reply that pushes to a scheduled call.",
    exampleInput: {
      lead_message:
        "Hey — we’re getting leads from ads but they don’t convert. Can you help improve our pipeline?",
      your_offer:
        "AI SDR + lead qualification + appointment-setting automation for agencies",
      calendar_link: "https://cal.com/yourname/intro",
      tone: "executive",
    },
  },
  {
    id: "support-autoresponder",
    name: "Support Autoresponder (Resolve Tickets)",
    description: "Draft support replies + internal actions, aligned to policy.",
    exampleInput: {
      customer_message:
        "My package never arrived. Tracking says delivered but I don't have it.",
      order_context: { order_id: "A-10492", status: "Delivered" },
      brand_voice: "Friendly, concise, proactive.",
    },
  },
  {
    id: "proposal-writer",
    name: "Proposal Writer (Close Deals)",
    description: "Generate a client-ready proposal with scope and pricing tiers.",
    exampleInput: {
      client_name: "Acme Dental",
      project_brief:
        "Automate lead follow-up and rescheduling reminders via SMS + email, integrated with our CRM.",
      desired_outcome:
        "Increase booked appointments and reduce no-shows by 20% in 60 days.",
      timeline: "3 weeks",
      budget_range: "$8k-$18k",
    },
  },
];

