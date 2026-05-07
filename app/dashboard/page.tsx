import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
      <p className="text-slate-400">
        {user?.email ?? "Sessão ativa (sem email visível)."}
      </p>
    </main>
  );
}
