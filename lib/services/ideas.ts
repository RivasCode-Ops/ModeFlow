import { prisma } from "@/lib/prisma";
import { ensureUserByEmail } from "@/lib/services/user-identity";

export async function listIdeasByMode(email: string, modeId: string) {
  const user = await ensureUserByEmail(email);

  return prisma.idea.findMany({
    where: { userId: user.id, modeId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createIdeaByMode(
  email: string,
  modeId: string,
  content: string,
) {
  const user = await ensureUserByEmail(email);

  return prisma.idea.create({
    data: {
      userId: user.id,
      modeId,
      content,
    },
  });
}
