"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { bubbleDiameterPx } from "./bubble-scale";
import { LifeModeBubble } from "./life-mode-bubble";
import { MOCK_LIFE_MODES } from "./mock-life-modes";

type Props = {
  userEmail?: string | null;
};

export function LifeModesDashboard({ userEmail }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeId = searchParams.get("mode");

  const selected = useMemo(() => {
    if (!modeId) return MOCK_LIFE_MODES[0];
    return MOCK_LIFE_MODES.find((m) => m.id === modeId) ?? MOCK_LIFE_MODES[0];
  }, [modeId]);

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
      MOCK_LIFE_MODES.map((mode, index) => ({
        mode,
        index,
        size: bubbleDiameterPx(mode.timeSpentMinutes, mode.tasksCount),
      })),
    [],
  );

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
          {userEmail ? `Conta: ${userEmail}` : "Mock UI — dados fixos até ligar ao Prisma."}
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
          Contexto: <span className="text-indigo-300">{selected.title}</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          URL persistente:{" "}
          <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[11px] text-slate-300">
            /dashboard?mode={selected.id}
          </code>
        </p>
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Where I left off
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            {selected.whereILeftOff}
          </p>
        </div>
      </section>
    </div>
  );
}
