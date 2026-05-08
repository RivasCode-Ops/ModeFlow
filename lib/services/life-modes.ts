import { prisma } from "@/lib/prisma";
import { ensureUserByEmail } from "@/lib/services/user-identity";

export type DashboardLifeMode = {
  id: string;
  title: string;
  color: string;
  whereILeftOff: string;
  tasksCount: number;
  tasksDone: number;
  timeSpentMinutes: number;
  projects: { id: string; name: string; progress: number }[];
  ideas: { id: string; content: string }[];
  links: { id: string; title: string; url: string }[];
  documents: { id: string; title: string; url: string }[];
};

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
      projects: {
        select: {
          id: true,
          name: true,
          progress: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      ideas: {
        select: {
          id: true,
          content: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      links: {
        select: {
          id: true,
          title: true,
          url: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      documentRefs: {
        select: {
          id: true,
          title: true,
          url: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
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
      projects: mode.projects,
      ideas: mode.ideas,
      links: mode.links,
      documents: mode.documentRefs,
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
