import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskStatus } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { getLifeModesWithStatsByEmail } from "@/lib/services/life-modes";
import { listProjectsByMode } from "@/lib/services/projects";
import { listIdeasByMode } from "@/lib/services/ideas";
import { listTasksByMode } from "@/lib/services/tasks";
import {
  createTaskInModeAction,
  saveModeContextInWorkspaceAction,
  toggleTaskDoneInModeAction,
  updateProjectProgressInModeAction,
  updateTaskStatusInModeAction,
} from "./actions";

type PageProps = {
  params: Promise<{ modeId: string }>;
};

export default async function ModeWorkspacePage({ params }: PageProps) {
  const { modeId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return notFound();

  const [modes, projects, tasks, ideas] = await Promise.all([
    getLifeModesWithStatsByEmail(user.email, user.user_metadata?.name),
    listProjectsByMode(user.email, modeId),
    listTasksByMode(user.email, modeId),
    listIdeasByMode(user.email, modeId),
  ]);

  const mode = modes.find((m) => m.id === modeId);
  if (!mode) return notFound();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 bg-slate-950 px-4 pb-16 pt-8 text-slate-100 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Workspace de área</p>
          <h1 className="text-3xl font-semibold">{mode.title}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {mode.tasksDone}/{mode.tasksCount} tarefas concluídas • {mode.timeSpentMinutes} min dedicados
          </p>
        </div>
        <Link
          href={`/dashboard?mode=${mode.id}`}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          Voltar para bolhas
        </Link>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Onde parei</h2>
        <form action={saveModeContextInWorkspaceAction} className="mt-3 flex flex-col gap-3">
          <input type="hidden" name="modeId" value={mode.id} />
          <textarea
            name="whereILeftOff"
            defaultValue={mode.whereILeftOff}
            rows={3}
            maxLength={500}
            className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 focus:ring-2"
          />
          <button
            type="submit"
            className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Salvar contexto
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Nova tarefa (fluxo diário)</h2>
          <form action={createTaskInModeAction} className="mt-3 flex flex-col gap-2">
            <input type="hidden" name="modeId" value={mode.id} />
            <input
              name="content"
              required
              minLength={2}
              maxLength={180}
              placeholder="Descreva a tarefa..."
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 placeholder:text-slate-500 focus:ring-2"
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                name="time"
                type="datetime-local"
                className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 focus:ring-2"
              />
              <select
                name="projectId"
                className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 focus:ring-2"
                defaultValue=""
              >
                <option value="">Sem projeto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select
                name="status"
                className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 focus:ring-2"
                defaultValue={TaskStatus.TODO}
              >
                <option value={TaskStatus.TODO}>TODO</option>
                <option value={TaskStatus.IN_PROGRESS}>IN_PROGRESS</option>
                <option value={TaskStatus.BLOCKED}>BLOCKED</option>
                <option value={TaskStatus.DONE}>DONE</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-1 w-fit rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Criar tarefa
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Projetos (progresso)</h2>
          <ul className="mt-3 space-y-3">
            {projects.length ? (
              projects.map((project) => (
                <li key={project.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{project.name}</span>
                    <span className="text-slate-400">{project.progress}%</span>
                  </div>
                  <form action={updateProjectProgressInModeAction} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="modeId" value={mode.id} />
                    <input type="hidden" name="projectId" value={project.id} />
                    <input
                      name="progress"
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={project.progress}
                      className="w-20 rounded-lg border border-white/15 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none ring-indigo-400 focus:ring-2"
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-white/15 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                    >
                      Atualizar
                    </button>
                  </form>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-500">Sem projetos nesta área.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Tarefas ativas</h2>
        <ul className="mt-3 space-y-2">
          {tasks.length ? (
            tasks.map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className={task.isDone ? "line-through text-slate-500" : "text-slate-200"}>
                      {task.content}
                    </span>
                    <span className="text-xs text-slate-500">
                      {task.project?.name ? `Projeto: ${task.project.name} • ` : ""}
                      {task.time ? new Date(task.time).toLocaleString("pt-BR") : "Sem horário"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={toggleTaskDoneInModeAction}>
                      <input type="hidden" name="modeId" value={mode.id} />
                      <input type="hidden" name="taskId" value={task.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-white/15 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                      >
                        {task.isDone ? "Reabrir" : "Concluir"}
                      </button>
                    </form>
                    <form action={updateTaskStatusInModeAction} className="flex items-center gap-1">
                      <input type="hidden" name="modeId" value={mode.id} />
                      <input type="hidden" name="taskId" value={task.id} />
                      <select
                        name="status"
                        defaultValue={task.status}
                        className="rounded-lg border border-white/15 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none ring-indigo-400 focus:ring-2"
                      >
                        <option value={TaskStatus.TODO}>TODO</option>
                        <option value={TaskStatus.IN_PROGRESS}>IN_PROGRESS</option>
                        <option value={TaskStatus.BLOCKED}>BLOCKED</option>
                        <option value={TaskStatus.DONE}>DONE</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg border border-white/15 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                      >
                        Salvar
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-xs text-slate-500">Sem tarefas ainda. Crie a primeira acima.</li>
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Ideias recentes</h2>
        <ul className="mt-3 space-y-2">
          {ideas.length ? (
            ideas.map((idea) => (
              <li key={idea.id} className="rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-slate-200">
                {idea.content}
              </li>
            ))
          ) : (
            <li className="text-xs text-slate-500">Sem ideias ainda nesta área.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
