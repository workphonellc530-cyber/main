"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getSession } from "@/lib/session";

const emailSchema = z.string().trim().toLowerCase().email();
const passwordSchema = z.string().min(10).max(200);

export type AuthActionState =
  | { ok: true }
  | { ok: false; error: string };

function orgNameFromEmail(email: string) {
  const domain = email.split("@")[1] || "workspace";
  return domain;
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const emailResult = emailSchema.safeParse(rawEmail);
  const passwordResult = passwordSchema.safeParse(rawPassword);

  if (!emailResult.success || !passwordResult.success) {
    return { ok: false, error: "Enter a valid email and a password (10+ chars)." };
  }

  const email = emailResult.data;
  const password = passwordResult.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Account already exists. Log in instead." };

  const passwordHash = await hashPassword(password);

  const org = await prisma.organization.create({
    data: {
      name: orgNameFromEmail(email),
      memberships: {
        create: {
          role: "OWNER",
          user: {
            create: {
              email,
              passwordHash,
            },
          },
        },
      },
      plan: { create: { tier: "FREE" } },
    },
    include: { memberships: { include: { user: true } } },
  });

  const user = org.memberships[0]?.user;
  if (!user) return { ok: false, error: "Signup failed. Please try again." };

  const session = await getSession();
  session.userId = user.id;
  session.orgId = org.id;
  await session.save();

  redirect("/app");
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const emailResult = emailSchema.safeParse(rawEmail);
  const passwordResult = z.string().safeParse(rawPassword);

  if (!emailResult.success || !passwordResult.success) {
    return { ok: false, error: "Invalid credentials." };
  }

  const email = emailResult.data;
  const password = passwordResult.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { memberships: true },
  });
  if (!user) return { ok: false, error: "Invalid credentials." };

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { ok: false, error: "Invalid credentials." };

  const membership = user.memberships[0];
  if (!membership) return { ok: false, error: "No organization found for user." };

  const session = await getSession();
  session.userId = user.id;
  session.orgId = membership.orgId;
  await session.save();

  redirect("/app");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}

