import { prisma } from "@/lib/prisma";
import { ensureUserByEmail } from "@/lib/services/user-identity";

export async function listDocumentsByMode(email: string, modeId: string) {
  const user = await ensureUserByEmail(email);

  return prisma.documentRef.findMany({
    where: { userId: user.id, modeId },
    orderBy: { createdAt: "desc" },
  });
}
