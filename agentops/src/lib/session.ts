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
  return getIronSession<SessionData>(cookies(), sessionOptions);
}

