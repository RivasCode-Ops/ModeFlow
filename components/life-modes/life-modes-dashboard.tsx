"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { bubbleDiameterPx } from "./bubble-scale";
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
        {MOCK_LIFE_MODES.map((mode, index) => {
          const size = bubbleDiameterPx(mode.timeSpentMinutes, mode.tasksCount);
          const active = selected.id === mode.id;

          return (
            <motion.button
              key={mode.id}
              type="button"
              layout
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: active ? 1.06 : 1,
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                delay: index * 0.05,
              }}
              onClick={() => setMode(mode.id)}
              className="relative flex shrink-0 cursor-pointer flex-col items-center justify-center rounded-full border text-center shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              style={{
                width: size,
                height: size,
                borderColor: active ? `${mode.color}cc` : "rgba(255,255,255,0.12)",
                background: `radial-gradient(circle at 30% 25%, ${mode.color}55, rgba(15,23,42,0.85))`,
                boxShadow: active
                  ? `0 0 0 2px ${mode.color}66, 0 25px 50px -12px rgba(0,0,0,0.65)`
                  : "0 20px 40px -15px rgba(0,0,0,0.55)",
              }}
            >
              <span
                className="px-3 text-sm font-medium leading-tight text-white drop-shadow-sm sm:text-base"
                style={{ maxWidth: size * 0.85 }}
              >
                {mode.title}
              </span>
              <span className="mt-1 text-[10px] font-medium text-white/75 sm:text-xs">
                {mode.tasksCount} tarefas · {mode.timeSpentMinutes} min
              </span>
            </motion.button>
          );
        })}
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
