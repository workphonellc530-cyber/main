import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function requireUserContext() {
  const session = await getSession();
  if (!session.userId || !session.orgId) redirect("/login");

  const membership = await prisma.membership.findUnique({
    where: { userId_orgId: { userId: session.userId, orgId: session.orgId } },
    include: { user: true, org: { include: { plan: true } } },
  });

  if (!membership) {
    session.destroy();
    redirect("/login");
  }

  return {
    session,
    user: membership.user,
    org: membership.org,
    plan: membership.org.plan,
    role: membership.role,
  };
}

