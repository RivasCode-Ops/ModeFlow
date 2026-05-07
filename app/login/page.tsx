"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "github";

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const supabase = createClient();

  const signInWithProvider = async (provider: Provider) => {
    setLoadingProvider(provider);

    const origin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      alert(`Falha no login com ${provider}. Tente novamente.`);
      setLoadingProvider(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
          <h1 className="text-2xl font-semibold">Entrar no ModeFlow</h1>
          <p className="mt-2 text-sm text-slate-400">
            Use um provedor social para acessar sua conta.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => signInWithProvider("google")}
              disabled={loadingProvider !== null}
              className="w-full rounded-lg bg-white px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingProvider === "google" ? "Conectando com Google..." : "Continuar com Google"}
            </button>

            <button
              onClick={() => signInWithProvider("github")}
              disabled={loadingProvider !== null}
              className="w-full rounded-lg bg-slate-800 px-4 py-3 font-medium text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingProvider === "github" ? "Conectando com GitHub..." : "Continuar com GitHub"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
