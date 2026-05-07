# ModeFlow - SaaS de Produtividade Gamificada

## Agente ModeFlow

Este projeto utiliza um **Agente de IA** para guiar a implementacao passo a passo.

### Como usar

1. Abra o arquivo [`AGENTE_MODEFLOW_PROMPT.md`](./AGENTE_MODEFLOW_PROMPT.md)
2. Copie todo o conteudo
3. Cole no Cursor (ou qualquer LLM)
4. O agente comecara a execucao pelo **Comando #1**

### Estrutura do Agente

- **1 comando por vez** - evita sobrecarga
- **Confirmacao obrigatoria** - voce controla o ritmo
- **Tratamento de erro** - causa + solucao imediata
- **Checkpoints** - progresso claro a cada 3 comandos

### Tecnologias

- Next.js 14 + TypeScript + Tailwind
- Supabase Auth (Google/GitHub)
- Prisma + PostgreSQL
- Zustand, Framer Motion, Recharts
- OpenAI API

---

## Variáveis de ambiente

1. Copie `.env.example` para `.env.local`
2. Preencha no Supabase (Project Settings → API e Database)
3. Senhas com caracteres especiais na `DATABASE_URL`: use a URI gerada pelo painel ou codifique (`@` → `%40`)

```bash
copy .env.example .env.local
```

## Desenvolvimento

```bash
# Instalar dependencias
npm install

# Rodar em desenvolvimento
npm run dev

# Build de producao
npm run build

# Prisma (após DATABASE_URL válida)
npm run db:push
```


## Estrutura de Pastas

```text
ModeFlow/
├── app/                    # Next.js App Router
├── lib/                    # Utilitarios (Prisma, Supabase)
├── prisma/                 # Schema do banco
├── docs/business/          # Junction para 01_NEGOCIOS
└── AGENTE_MODEFLOW_PROMPT.md
```
