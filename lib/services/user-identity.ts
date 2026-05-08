import { prisma } from "@/lib/prisma";

export async function ensureUserByEmail(email: string, name?: string | null) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) return existing;

  return prisma.user.create({
    data: {
      email,
      name: name ?? null,
    },
  });
}
