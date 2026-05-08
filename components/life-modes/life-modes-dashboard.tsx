"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useCallback, useMemo } from "react";
import { createLifeModeAction, saveWhereILeftOffAction } from "@/app/dashboard/actions";
import { bubbleDiameterPx } from "./bubble-scale";
import { LifeModeBubble } from "./life-mode-bubble";

type Props = {
  userEmail?: string | null;
  modes: {
    id: string;
    title: string;
    color: string;
    whereILeftOff: string;
    tasksCount: number;
    tasksDone: number;
    timeSpentMinutes: number;
  }[];
};

const initialActionState = {
  ok: false,
  message: "",
};

export function LifeModesDashboard({ userEmail, modes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeId = searchParams.get("mode");
  const [createState, createFormAction, isCreating] = useActionState(
    createLifeModeAction,
    initialActionState,
  );
  const [saveState, saveFormAction, isSaving] = useActionState(
    saveWhereILeftOffAction,
    initialActionState,
  );

  const selected = useMemo(() => {
    if (modes.length === 0) return null;
    if (!modeId) return modes[0];
    return modes.find((m) => m.id === modeId) ?? modes[0];
  }, [modeId, modes]);

  const setMode = useCallback(
    (id: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("mode", id);
      router.push(`/dashboard?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const modeRows = useMemo(
    () =>
      modes.map((mode, index) => ({
        mode,
        index,
        size: bubbleDiameterPx(mode.timeSpentMinutes, mode.tasksCount),
      })),
    [modes],
  );

  const completionPercent = selected
    ? Math.round((selected.tasksDone / Math.max(selected.tasksCount, 1)) * 100)
    : 0;

  if (modes.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-16 pt-12 sm:px-6">
        <h1 className="text-3xl font-semibold text-slate-50">Crie sua primeira área de vida</h1>
        <p className="text-sm text-slate-400">
          O dashboard com bolhas aparece assim que você criar a primeira área.
        </p>
        <form action={createFormAction} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <input
            name="title"
            required
            minLength={2}
            maxLength={60}
            placeholder="Ex.: Trabalho, Saúde, Família"
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 placeholder:text-slate-500 focus:ring-2"
          />
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isCreating ? "Criando..." : "Criar área"}
          </button>
          {createState.message ? (
            <p className="text-xs text-emerald-300">{createState.message}</p>
          ) : null}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-6 sm:px-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-slate-500">
          LifeModes
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          Seus modos de vida
        </h1>
        <p className="text-sm text-slate-400">
          {userEmail ? `Conta: ${userEmail}` : "Sem usuário autenticado."}
        </p>
      </header>

      <section
        aria-label="Bolhas dos modos"
        className="relative flex min-h-[320px] flex-wrap items-center justify-center gap-6 sm:min-h-[380px] sm:gap-8"
      >
        {modeRows.map(({ mode, index, size }) => (
          <LifeModeBubble
            key={mode.id}
            modeId={mode.id}
            title={mode.title}
            color={mode.color}
            size={size}
            tasksCount={mode.tasksCount}
            timeSpentMinutes={mode.timeSpentMinutes}
            active={selected.id === mode.id}
            index={index}
            onSelect={setMode}
          />
        ))}
      </section>

      <section
        aria-live="polite"
        className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md"
      >
        <h2 className="text-lg font-semibold text-slate-100">
          Contexto: <span className="text-indigo-300">{selected?.title}</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          URL persistente:{" "}
          <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[11px] text-slate-300">
            /dashboard?mode={selected?.id}
          </code>
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Progresso da área: {completionPercent}% ({selected?.tasksDone}/{selected?.tasksCount} tarefas)
        </p>
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Where I left off
          </p>
          <form action={saveFormAction} className="mt-2 flex flex-col gap-3">
            <input type="hidden" name="modeId" value={selected?.id ?? ""} />
            <textarea
              key={selected?.id}
              name="whereILeftOff"
              defaultValue={selected?.whereILeftOff}
              rows={4}
              maxLength={500}
              placeholder="Descreva aqui exatamente de onde retomar quando voltar para esta área..."
              className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 placeholder:text-slate-500 focus:ring-2"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {isSaving ? "Salvando..." : "Salvar contexto"}
              </button>
              {saveState.message ? (
                <span className="text-xs text-emerald-300">{saveState.message}</span>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
