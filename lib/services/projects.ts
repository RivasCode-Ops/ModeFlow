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

export async function updateProjectProgressById(
  email: string,
  projectId: string,
  progress: number,
) {
  const user = await ensureUserByEmail(email);

  const clamped = Math.max(0, Math.min(100, progress));

  const result = await prisma.project.updateMany({
    where: { id: projectId, userId: user.id },
    data: { progress: clamped },
  });

  return result.count > 0;
}
