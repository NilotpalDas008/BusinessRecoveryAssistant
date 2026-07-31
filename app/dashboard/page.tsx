import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { DashboardSync } from "@/components/DashboardSync";
import { DashboardMockup } from "@/components/DashboardMockup";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles, UserCheck } from "lucide-react";

export default async function DashboardPage() {
  // Server-side authentication check using auth() from @clerk/nextjs/server
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress || "owner@example.com";

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100 selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#121218] via-[#161424] to-[#121218] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" className="gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Authenticated Session
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient-primary">{user?.firstName || "Business Owner"}</span>
            </h1>
            <p className="text-zinc-400 text-sm flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-400" />
              Signed in as <code className="text-purple-300 font-mono">{primaryEmail}</code>
            </p>
          </div>

          <div className="z-10 flex items-center gap-3">
            <Badge variant="purple" className="px-3 py-1.5 text-xs font-semibold gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              ReviveAI Recovery Engine Online
            </Badge>
          </div>
        </div>

        {/* Sync with Express MongoDB Backend */}
        <DashboardSync />

        {/* Main Dashboard Control Mockup */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Live Business Recovery Control Center
          </h2>
          <DashboardMockup />
        </div>
      </main>

      <Footer />
    </div>
  );
}
