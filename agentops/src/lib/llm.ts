import OpenAI from "openai";

import { getOpenAiConfig } from "@/lib/env";

export type LlmResult = {
  provider: "openai";
  model: string;
  text: string;
};

export async function generateText({
  system,
  prompt,
  temperature = 0.2,
}: {
  system: string;
  prompt: string;
  temperature?: number;
}): Promise<LlmResult> {
  const { apiKey, model } = getOpenAiConfig();
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Set it in your environment to run playbooks.",
    );
  }

  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0]?.message?.content?.trim() || "";

  return { provider: "openai", model, text };
}

