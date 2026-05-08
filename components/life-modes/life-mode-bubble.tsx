"use client";

import { motion } from "framer-motion";
import { memo, useCallback } from "react";

export type LifeModeBubbleProps = {
  modeId: string;
  title: string;
  color: string;
  size: number;
  tasksCount: number;
  timeSpentMinutes: number;
  active: boolean;
  index: number;
  onSelect: (id: string) => void;
};

function LifeModeBubbleInner({
  modeId,
  title,
  color,
  size,
  tasksCount,
  timeSpentMinutes,
  active,
  index,
  onSelect,
}: LifeModeBubbleProps) {
  const handleClick = useCallback(() => {
    onSelect(modeId);
  }, [modeId, onSelect]);

  return (
    <motion.button
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
      onClick={handleClick}
      className="relative flex shrink-0 cursor-pointer flex-col items-center justify-center rounded-full border text-center shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      style={{
        width: size,
        height: size,
        borderColor: active ? `${color}cc` : "rgba(255,255,255,0.12)",
        background: `radial-gradient(circle at 30% 25%, ${color}55, rgba(15,23,42,0.85))`,
        boxShadow: active
          ? `0 0 0 2px ${color}66, 0 25px 50px -12px rgba(0,0,0,0.65)`
          : "0 20px 40px -15px rgba(0,0,0,0.55)",
      }}
    >
      <span
        className="px-3 text-sm font-medium leading-tight text-white drop-shadow-sm sm:text-base"
        style={{ maxWidth: size * 0.85 }}
      >
        {title}
      </span>
      <span className="mt-1 text-[10px] font-medium text-white/75 sm:text-xs">
        {tasksCount} tarefas · {timeSpentMinutes} min
      </span>
    </motion.button>
  );
}

export const LifeModeBubble = memo(LifeModeBubbleInner);
