import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

import { getSessionSecret } from "@/lib/env";

export type SessionData = {
  userId?: string;
  orgId?: string;
};

const sessionOptions: SessionOptions = {
  password: getSessionSecret(),
  cookieName: "agentops_session",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  // Next.js 16 types make `cookies()` context-dependent (mutable in actions/handlers,
  // read-only in server components). For sessions we only mutate inside actions.
  // `iron-session` supports Next cookies stores at runtime; we loosen the type here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getIronSession<SessionData>(cookieStore as any, sessionOptions);
}

