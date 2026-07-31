import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DashboardMockup } from "./DashboardMockup";
import { Sparkles, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-grid-pattern">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center">
              <Badge variant="purple" className="px-3 py-1.5 text-xs sm:text-sm gap-2">
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                <span>Next-Gen AI Customer Recovery Platform</span>
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Turn Bad Reviews Into{" "}
              <span className="text-gradient-primary">Loyal Customers.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              ReviveAI uses AI to analyze customer reviews, detect recurring issues,
              recover unhappy customers, and grow your business automatically.
            </p>

            {/* Dual CTAs with Clerk Auth integration */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
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
                    Explore Recovery Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </Show>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-white">4.9/5</span> rating from 500+ local businesses
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Zero Risk • Setup in 2 mins</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className="lg:col-span-6 w-full max-w-2xl mx-auto">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
