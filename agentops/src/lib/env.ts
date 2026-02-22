export function getAppUrl() {
  return process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function getSessionSecret() {
  const secret =
    process.env.SESSION_SECRET ||
    "dev_insecure_change_me_dev_insecure_change_me_dev_insecure_change_me";

  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("Missing SESSION_SECRET in production environment.");
  }

  if (secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters.");
  }

  return secret;
}

export function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  return { apiKey, model };
}

export function getStripeConfig() {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    priceId: process.env.STRIPE_PRICE_ID || "",
  };
}

