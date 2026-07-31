import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center p-6 bg-grid-pattern relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center space-y-6 z-10">
        <Link href="/" className="flex items-center gap-2.5 group mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-900/30">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09090B]">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Revive<span className="text-gradient-primary">AI</span>
          </span>
        </Link>

        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />

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
