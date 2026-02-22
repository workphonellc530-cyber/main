"use server";

import { z } from "zod";

import { prisma } from "@/lib/db";
import { requireUserContext } from "@/lib/current";
import { generateText } from "@/lib/llm";
import { getWorkflow, type WorkflowId } from "@/lib/workflows";
import type { Prisma } from "@prisma/client";

export type RunActionState =
  | { ok: true; runId: string; output: string }
  | { ok: false; error: string };

const workflowIdSchema = z.enum([
  "lead-qualifier",
  "support-autoresponder",
  "proposal-writer",
]);

export async function runWorkflowAction(
  _prevState: RunActionState,
  formData: FormData,
): Promise<RunActionState> {
  const { user, org, plan } = await requireUserContext();

  if (plan?.tier !== "PRO") {
    const successfulRuns = await prisma.agentRun.count({
      where: { orgId: org.id, status: "SUCCESS" },
    });
    if (successfulRuns >= 10) {
      return {
        ok: false,
        error:
          "Free plan limit reached (10 successful runs). Upgrade in Billing to keep running playbooks.",
      };
    }
  }

  const workflowIdResult = workflowIdSchema.safeParse(formData.get("workflow"));
  if (!workflowIdResult.success) return { ok: false, error: "Pick a workflow." };

  const workflowId = workflowIdResult.data as WorkflowId;
  const inputRaw = String(formData.get("input") || "").trim();
  if (!inputRaw) return { ok: false, error: "Paste JSON input." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(inputRaw);
  } catch {
    return { ok: false, error: "Input must be valid JSON." };
  }

  const wf = getWorkflow(workflowId);
  const inputResult = wf.inputSchema.safeParse(parsed);
  if (!inputResult.success) {
    return {
      ok: false,
      error: `Input does not match workflow schema: ${inputResult.error.issues[0]?.message || "invalid"}`,
    };
  }

  const startedAt = new Date();
  const run = await prisma.agentRun.create({
    data: {
      orgId: org.id,
      userId: user.id,
      workflow: wf.id,
      input: inputResult.data as Prisma.InputJsonValue,
      output: "",
      status: null,
      startedAt,
    },
  });

  try {
    const prompt = wf.buildPrompt(inputResult.data);
    const result = await generateText({ system: wf.system, prompt });
    const finishedAt = new Date();

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        output: result.text,
        provider: result.provider,
        model: result.model,
        status: "SUCCESS",
        finishedAt,
      },
    });

    return { ok: true, runId: run.id, output: result.text };
  } catch (err) {
    const finishedAt = new Date();
    const message =
      err instanceof Error ? err.message : "Agent run failed. Please try again.";

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "ERROR",
        error: message,
        finishedAt,
      },
    });

    return { ok: false, error: message };
  }
}

