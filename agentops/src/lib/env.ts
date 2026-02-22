export function getAppUrl() {
  return process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function getSessionSecret() {
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  const fallback =
    isBuildPhase
      ? "build_placeholder_secret_build_placeholder_secret_build_placeholder_secret"
      : "dev_insecure_change_me_dev_insecure_change_me_dev_insecure_change_me";

  const secret = process.env.SESSION_SECRET || fallback;

  // Allow builds to succeed without runtime secrets; enforce at runtime.
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.SESSION_SECRET &&
    !isBuildPhase
  ) {
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

