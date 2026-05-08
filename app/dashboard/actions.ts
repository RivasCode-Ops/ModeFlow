"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  createLifeModeForUserByEmail,
  updateWhereILeftOffByEmail,
} from "@/lib/services/life-modes";

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
