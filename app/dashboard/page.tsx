import { Suspense } from "react";
import { LifeModesDashboard } from "@/components/life-modes/life-modes-dashboard";
import { getLifeModesWithStatsByEmail } from "@/lib/services/life-modes";
import { createClient } from "@/lib/supabase/server";

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 pt-6">
      <div className="h-6 w-40 rounded bg-slate-800" />
      <div className="mt-4 h-10 w-2/3 rounded bg-slate-800" />
      <div className="mt-10 flex justify-center gap-6">
        <div className="h-28 w-28 rounded-full bg-slate-800" />
        <div className="h-36 w-36 rounded-full bg-slate-800" />
        <div className="h-24 w-24 rounded-full bg-slate-800" />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const modes = user?.email
    ? await getLifeModesWithStatsByEmail(user.email, user.user_metadata?.name)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <Suspense fallback={<DashboardSkeleton />}>
        <LifeModesDashboard userEmail={user?.email} modes={modes} />
      </Suspense>
    </div>
  );
}
