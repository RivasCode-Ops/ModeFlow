/**
 * Tamanho base da bolha (px). Log evita crescimento explosivo.
 */
export function bubbleDiameterPx(
  timeSpentMinutes: number,
  tasksCount: number,
  opts?: { min?: number; max?: number; timeWeight?: number; tasksWeight?: number },
): number {
  const min = opts?.min ?? 72;
  const max = opts?.max ?? 168;
  const tw = opts?.timeWeight ?? 10;
  const cw = opts?.tasksWeight ?? 8;

  const raw =
    Math.log(timeSpentMinutes + 1) * tw + Math.log(tasksCount + 1) * cw;

  return Math.round(Math.min(Math.max(raw, min), max));
}
