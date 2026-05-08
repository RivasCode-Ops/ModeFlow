import { TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureUserByEmail } from "@/lib/services/user-identity";

export async function listTasksByMode(email: string, modeId: string) {
  const user = await ensureUserByEmail(email);

  return prisma.task.findMany({
    where: { userId: user.id, modeId },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ isDone: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTaskByMode(
  email: string,
  modeId: string,
  input: {
    content: string;
    time?: Date | null;
    projectId?: string | null;
    status?: TaskStatus;
  },
) {
  const user = await ensureUserByEmail(email);

  return prisma.task.create({
    data: {
      userId: user.id,
      modeId,
      content: input.content,
      time: input.time ?? null,
      projectId: input.projectId ?? null,
      status: input.status ?? TaskStatus.TODO,
      isDone: input.status === TaskStatus.DONE,
    },
  });
}

export async function toggleTaskDoneById(email: string, taskId: string) {
  const user = await ensureUserByEmail(email);

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: user.id },
    select: { id: true, isDone: true },
  });

  if (!task) return false;

  await prisma.task.update({
    where: { id: task.id },
    data: {
      isDone: !task.isDone,
      status: task.isDone ? TaskStatus.IN_PROGRESS : TaskStatus.DONE,
    },
  });

  return true;
}

export async function updateTaskStatusById(
  email: string,
  taskId: string,
  status: TaskStatus,
) {
  const user = await ensureUserByEmail(email);

  const result = await prisma.task.updateMany({
    where: { id: taskId, userId: user.id },
    data: {
      status,
      isDone: status === TaskStatus.DONE,
    },
  });

  return result.count > 0;
}
