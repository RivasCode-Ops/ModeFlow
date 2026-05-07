export type MockLifeMode = {
  id: string;
  title: string;
  color: string;
  /** minutos — influencia o tamanho da bolha */
  timeSpentMinutes: number;
  tasksCount: number;
  /** texto “onde parei” — depois vem do Prisma */
  whereILeftOff: string;
};

/** Dados fictícios para UI (opção 1 — sem mudar schema) */
export const MOCK_LIFE_MODES: MockLifeMode[] = [
  {
    id: "auto-shop",
    title: "Auto Shop Manager",
    color: "#6366f1",
    timeSpentMinutes: 420,
    tasksCount: 18,
    whereILeftOff: "Revisar orçamento do cliente #204 antes da call de amanhã.",
  },
  {
    id: "house",
    title: "Man of the House",
    color: "#22c55e",
    timeSpentMinutes: 180,
    tasksCount: 9,
    whereILeftOff: "Comprar filtros da HVAC — lista no Notes.",
  },
  {
    id: "dev",
    title: "Dev & Produto",
    color: "#f97316",
    timeSpentMinutes: 960,
    tasksCount: 34,
    whereILeftOff: "Terminar middleware de auth e testar OAuth no localhost.",
  },
  {
    id: "health",
    title: "Saúde & Energia",
    color: "#ec4899",
    timeSpentMinutes: 90,
    tasksCount: 5,
    whereILeftOff: "Alongamento 10min — pendente desde segunda.",
  },
];
