import { prisma } from "@/lib/prisma";
import { ensureUserByEmail } from "@/lib/services/user-identity";

export async function listProjectsByMode(email: string, modeId: string) {
  const user = await ensureUserByEmail(email);

  return prisma.project.findMany({
    where: { userId: user.id, modeId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProjectByMode(
  email: string,
  modeId: string,
  name: string,
) {
  const user = await ensureUserByEmail(email);

  return prisma.project.create({
    data: {
      userId: user.id,
      modeId,
      name,
    },
  });
}
