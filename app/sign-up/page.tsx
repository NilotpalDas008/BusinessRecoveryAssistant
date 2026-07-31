import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center p-6 bg-grid-pattern relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121216]/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-900/30">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09090B]">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Clerk Sign Up Page
          </h1>
          <p className="text-xs text-zinc-400">
            Authentication provider placeholder route (`/sign-up`).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-zinc-300 font-mono">
          [ Clerk Registration Component Placeholder ]
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to ReviveAI Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
