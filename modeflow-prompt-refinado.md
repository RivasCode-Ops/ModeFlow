# ModeFlow — Prompt refinado (sessão #6)

> Resultado da sessão de refinamento iterativo no Prompt Forge.

## Metadados da sessão

- **Sessão**: #6 — `MAX_REACHED`
- **Iniciada em**: 2026-05-07 20:49:07
- **Concluída em**: 2026-05-07T21:04:09
- **Iterações**: 5 (max_iterations=5, threshold=8.5)
- **Critério mais fraco final**: `completude`

## Diagnóstico da juíza meta (última iteração)

> Nota mínima célula = 8.00 < threshold 8.5 (critério mais fraco: completude média=9.33). Juíza (gemini-2.5-flash) [usando fallback Gemini Flash porque Claude Opus falhou] | DIAGNÓSTICO: O prompt atual, embora detalhado, permite que o agente entregue um grande bloco de informações de setup inicial de uma vez. Isso pode sobrecarregar o usuário e reduzir a percepção de um guia passo a passo verdadeiramente 'completo' e incremental, apesar de todo o conteúdo necessário estar presente. | ESTRATÉGIA: Reforçar a diretriz de 'entrega incremental': o agente deve apresentar apenas a *próxima micro-etapa atômica* e aguardar confirmação antes de avançar, garantindo um fluxo de 'um passo por vez' e eliminando a sobrecarga de informação.

## Prompt refinado (final)

```xml
<prompt_original>
  <objetivo>
    Criar um agente de prompt para o projeto ModeFlow, detalhando todas as características técnicas necessárias.
    O agente gerado deve ser capaz de guiar a implementação de forma clara e acionável, garantindo uma execução 'sem travar' para o usuário.
  </objetivo>
  <projeto_modeflow>
    <nome>ModeFlow</nome>
    <caracteristicas_tecnicas>
      <secao id="setup_base">
        <titulo>Setup base do projeto</titulo>
        <itens>
          <item>Next.js 14 com TypeScript + Tailwind</item>
          <item>Dependências: Supabase, Prisma, Zustand, Recharts, Framer Motion, OpenAI, bcryptjs</item>
        </itens>
      </secao>
      <secao id="banco_dados_prisma">
        <titulo>Banco de dados (Prisma)</titulo>
        <itens>
          <item>
            `prisma/schema.prisma` com modelos:
            <modelo>User</modelo>
            <modelo>LifeMode</modelo>
            <modelo>Task</modelo>
          </item>
          <item>Geração do client Prisma (`prisma generate`)</item>
          <item>Sincronização inicial com banco (`prisma db push`)</item>
        </itens>
      </secao>
      <secao id="autenticacao_supabase">
        <titulo>Autenticação (Supabase Auth)</titulo>
        <itens>
          <item>Configuração de variáveis no `.env.local`</item>
          <item>Cliente browser: `lib/supabase/client.ts`</item>
          <item>Cliente server: `lib/supabase/server.ts`</item>
          <item>OAuth com **Google** e **GitHub**</item>
          <item>Proteção de rotas com `middleware.ts` (ex.: `/dashboard`)</item>
        </itens>
      </secao>
      <secao id="tela_login">
        <titulo>Tela de login</titulo>
        <itens>
          <item>Página `app/login/page.tsx`</item>
          <item>Botões de login social (Google/GitHub)</item>
          <item>Redirecionamento após autenticação (callback)</item>
        </itens>
      </secao>
      <secao id="camada_acesso_banco">
        <titulo>Camada de acesso ao banco</titulo>
        <itens>
          <item>Singleton Prisma em `lib/prisma.ts`</item>
        </itens>
      </secao>
      <secao id="validacao_tecnica">
        <titulo>Validação técnica</titulo>
        <itens>
          <item>Rodar projeto com `npm run dev`</item>
          <item>Verificar estrutura de arquivos obrigatórios</item>
          <item>Confirmar que não há erros no setup inicial</item>
        </itens>
      </secao>
      <secao id="organizacao_repositorio">
        <titulo>Organização do repositório</titulo>
        <itens>
          <item>Estrutura de pastas já definida</item>
          <item>Junction `docs/business` para pasta de negócios</item>
          <item>`.gitignore` ajustado para ignorar junction e artefatos</item>
        </itens>
      </secao>
    </caracteristicas_tecnicas>
    <proximos_passos_usuario>
      Se quiser, já te entrego em seguida um **Relatório v2 por prioridade** (MVP da semana 1, semana 2 e semana 3)
      para você executar sem travar. E que tenha todas características técnicas necessárias.
    </proximos_passos_usuario>
  </projeto_modeflow>
  <instrucoes_para_agente_de_prompt_gerado>
    <foco_acionabilidade>
      O agente de prompt que você irá gerar para o ModeFlow deve ser **altamente acionável**.
      Ele precisa instruir o modelo (que irá atuar como o agente ModeFlow) a:
      <diretriz>Apresentar as informações técnicas de forma organizada, modular e fácil de consumir, **iniciando obrigatoriamente pela primeira ação concreta** (ex: o comando de criação do projeto), e integrando detalhes técnicos relevantes conforme a necessidade da etapa, utilizando marcações e blocos de código sempre que aplicável.</diretriz>
      <diretriz>Apresentar as informações de forma **incremental e atômica**: após cada comando ou bloco de código executável, o agente deve solicitar confirmação do usuário (ex: 'Me confirme quando terminar' ou 'Você concluiu esta etapa?') antes de apresentar o próximo passo lógico e sequencial. Evite entregar múltiplos arquivos ou comandos extensos em uma única interação sem antes checar o progresso do usuário.</diretriz>
      <diretriz>Ser **imediatamente proativo** em sugerir o *próximo passo concreto e sequencial imediato* ao usuário **desde a primeira interação**, antecipando necessidades e propondo a ação *diretamente subsequente* para guiar a implementação de maneira fluida e 'sem travar', *sempre aguardando validação para avançar*.</diretriz>
      <diretriz>Descrever explicitamente como irá absorver e utilizar um futuro "Relatório v2 por prioridade"
        (que detalhará o MVP por semana) para decompor o projeto em entregas semanais, sequenciar tarefas e guiar o desenvolvimento
        passo a passo, garantindo que o usuário não trave em nenhuma etapa.</diretriz>
      <diretriz>Incluir exemplos claros de comandos que o usuário poderá dar ao agente ModeFlow, demonstrando a acionabilidade e facilitando a interação. Estes comandos devem refletir as fases do projeto e as capacidades do agente.</diretriz>
      <diretriz>Concluir sempre com uma chamada clara para a ação, indicando como o usuário pode iniciar a interação, fornecer o relatório de prioridades ou solicitar o próximo passo do projeto.</diretriz>
    </foco_acionabilidade>
  </instrucoes_para_agente_de_prompt_gerado>
</prompt_original>
```
