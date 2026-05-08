"use server";

import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createTaskByMode, toggleTaskDoneById, updateTaskStatusById } from "@/lib/services/tasks";
import { updateProjectProgressById } from "@/lib/services/projects";
import { updateWhereILeftOffByEmail } from "@/lib/services/life-modes";

const createTaskSchema = z.object({
  modeId: z.string().min(1),
  content: z.string().trim().min(2).max(180),
  time: z.string().optional(),
  projectId: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
});

const updateStatusSchema = z.object({
  modeId: z.string().min(1),
  taskId: z.string().min(1),
  status: z.nativeEnum(TaskStatus),
});

const updateProgressSchema = z.object({
  modeId: z.string().min(1),
  projectId: z.string().min(1),
  progress: z.coerce.number().int().min(0).max(100),
});

const updateContextSchema = z.object({
  modeId: z.string().min(1),
  whereILeftOff: z.string().trim().max(500),
});

async function getUserEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email ?? null;
}

export async function createTaskInModeAction(formData: FormData) {
  const email = await getUserEmail();
  if (!email) return;

  const payload = createTaskSchema.safeParse({
    modeId: formData.get("modeId"),
    content: formData.get("content"),
    time: formData.get("time"),
    projectId: formData.get("projectId"),
    status: formData.get("status"),
  });

  if (!payload.success) return;

  const taskTime = payload.data.time
    ? new Date(payload.data.time as string)
    : null;

  await createTaskByMode(email, payload.data.modeId, {
    content: payload.data.content,
    projectId: payload.data.projectId || null,
    status: payload.data.status,
    time: taskTime && !Number.isNaN(taskTime.valueOf()) ? taskTime : null,
  });

  revalidatePath(`/dashboard/${payload.data.modeId}`);
  revalidatePath("/dashboard");
}

export async function toggleTaskDoneInModeAction(formData: FormData) {
  const email = await getUserEmail();
  if (!email) return;

  const modeId = String(formData.get("modeId") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  if (!modeId || !taskId) return;

  await toggleTaskDoneById(email, taskId);

  revalidatePath(`/dashboard/${modeId}`);
  revalidatePath("/dashboard");
}

export async function updateTaskStatusInModeAction(formData: FormData) {
  const email = await getUserEmail();
  if (!email) return;

  const payload = updateStatusSchema.safeParse({
    modeId: formData.get("modeId"),
    taskId: formData.get("taskId"),
    status: formData.get("status"),
  });

  if (!payload.success) return;

  await updateTaskStatusById(email, payload.data.taskId, payload.data.status);
  revalidatePath(`/dashboard/${payload.data.modeId}`);
  revalidatePath("/dashboard");
}

export async function updateProjectProgressInModeAction(formData: FormData) {
  const email = await getUserEmail();
  if (!email) return;

  const payload = updateProgressSchema.safeParse({
    modeId: formData.get("modeId"),
    projectId: formData.get("projectId"),
    progress: formData.get("progress"),
  });

  if (!payload.success) return;

  await updateProjectProgressById(email, payload.data.projectId, payload.data.progress);
  revalidatePath(`/dashboard/${payload.data.modeId}`);
  revalidatePath("/dashboard");
}

export async function saveModeContextInWorkspaceAction(formData: FormData) {
  const email = await getUserEmail();
  if (!email) return;

  const payload = updateContextSchema.safeParse({
    modeId: formData.get("modeId"),
    whereILeftOff: formData.get("whereILeftOff"),
  });

  if (!payload.success) return;

  await updateWhereILeftOffByEmail(email, payload.data.modeId, payload.data.whereILeftOff);
  revalidatePath(`/dashboard/${payload.data.modeId}`);
  revalidatePath("/dashboard");
}
