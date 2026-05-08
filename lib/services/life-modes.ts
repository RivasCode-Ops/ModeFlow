import { prisma } from "@/lib/prisma";

export type DashboardLifeMode = {
  id: string;
  title: string;
  color: string;
  whereILeftOff: string;
  tasksCount: number;
  tasksDone: number;
  timeSpentMinutes: number;
};

async function ensureUserByEmail(email: string, name?: string | null) {
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

export async function getLifeModesWithStatsByEmail(
  email: string,
  name?: string | null,
): Promise<DashboardLifeMode[]> {
  const user = await ensureUserByEmail(email, name);

  const modes = await prisma.lifeMode.findMany({
    where: { userId: user.id },
    include: {
      tasks: {
        select: {
          isDone: true,
          time: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return modes.map((mode) => {
    const tasksDone = mode.tasks.filter((task) => task.isDone).length;
    const tasksCount = mode.tasks.length;
    const timedTasks = mode.tasks.filter((task) => task.time != null).length;

    return {
      id: mode.id,
      title: mode.title,
      color: mode.color,
      whereILeftOff: mode.whereILeftOff ?? "",
      tasksCount,
      tasksDone,
      // Placeholder de dedicacao ate existir FocusSession.
      timeSpentMinutes: timedTasks * 30 + tasksDone * 10,
    };
  });
}

export async function createLifeModeForUserByEmail(
  email: string,
  title: string,
  name?: string | null,
) {
  const user = await ensureUserByEmail(email, name);

  return prisma.lifeMode.create({
    data: {
      userId: user.id,
      title,
    },
  });
}

export async function updateWhereILeftOffByEmail(
  email: string,
  modeId: string,
  whereILeftOff: string,
) {
  const user = await ensureUserByEmail(email);

  const result = await prisma.lifeMode.updateMany({
    where: {
      id: modeId,
      userId: user.id,
    },
    data: {
      whereILeftOff,
    },
  });

  return result.count > 0;
}
