import Link from "next/link";
import { Button } from "./ui/button";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

export function CtaSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-grid-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#161325]/90 to-[#0c0a15]/90 p-8 sm:p-14 text-center shadow-2xl backdrop-blur-2xl shadow-purple-950/50 overflow-hidden">
          {/* Ambient lighting inside CTA card */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Start Recovering Revenue Today</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Recover <span className="text-gradient-primary">Lost Customers?</span>
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Join hundreds of local restaurants, salons, and retail shops already using ReviveAI to turn negative Google reviews into long-term customer loyalty.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Link href="#features">
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                    Go to Features
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </Show>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>14-day free trial • No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
