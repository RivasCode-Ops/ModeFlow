"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  createLifeModeForUserByEmail,
  updateWhereILeftOffByEmail,
} from "@/lib/services/life-modes";
import { createProjectByMode } from "@/lib/services/projects";
import { createIdeaByMode } from "@/lib/services/ideas";

export type DashboardActionState = {
  ok: boolean;
  message: string;
};

const updateContextSchema = z.object({
  modeId: z.string().min(1),
  whereILeftOff: z.string().trim().max(500),
});

const createModeSchema = z.object({
  title: z.string().trim().min(2).max(60),
});

const createProjectSchema = z.object({
  modeId: z.string().min(1),
  name: z.string().trim().min(2).max(80),
});

const createIdeaSchema = z.object({
  modeId: z.string().min(1),
  content: z.string().trim().min(2).max(300),
});

export async function saveWhereILeftOffAction(
  _: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, message: "Usuário não autenticado." };
  }

  const payload = updateContextSchema.safeParse({
    modeId: formData.get("modeId"),
    whereILeftOff: formData.get("whereILeftOff") ?? "",
  });

  if (!payload.success) {
    return { ok: false, message: "Dados inválidos para salvar contexto." };
  }

  await updateWhereILeftOffByEmail(user.email, payload.data.modeId, payload.data.whereILeftOff);
  revalidatePath("/dashboard");
  return { ok: true, message: "Contexto salvo." };
}

export async function createLifeModeAction(
  _: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, message: "Usuário não autenticado." };
  }

  const payload = createModeSchema.safeParse({
    title: formData.get("title"),
  });

  if (!payload.success) {
    return { ok: false, message: "Título inválido para nova área." };
  }

  await createLifeModeForUserByEmail(user.email, payload.data.title, user.user_metadata?.name);
  revalidatePath("/dashboard");
  return { ok: true, message: "Área criada." };
}

export async function createProjectAction(
  _: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, message: "Usuário não autenticado." };
  }

  const payload = createProjectSchema.safeParse({
    modeId: formData.get("modeId"),
    name: formData.get("name"),
  });

  if (!payload.success) {
    return { ok: false, message: "Nome de projeto inválido." };
  }

  await createProjectByMode(user.email, payload.data.modeId, payload.data.name);
  revalidatePath("/dashboard");
  return { ok: true, message: "Projeto criado." };
}

export async function createIdeaAction(
  _: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, message: "Usuário não autenticado." };
  }

  const payload = createIdeaSchema.safeParse({
    modeId: formData.get("modeId"),
    content: formData.get("content"),
  });

  if (!payload.success) {
    return { ok: false, message: "Ideia inválida." };
  }

  await createIdeaByMode(user.email, payload.data.modeId, payload.data.content);
  revalidatePath("/dashboard");
  return { ok: true, message: "Ideia criada." };
}
