import { prisma } from "@/lib/prisma";
import { ensureUserByEmail } from "@/lib/services/user-identity";

export async function listLinksByMode(email: string, modeId: string) {
  const user = await ensureUserByEmail(email);

  return prisma.importantLink.findMany({
    where: { userId: user.id, modeId },
    orderBy: { createdAt: "desc" },
  });
}
