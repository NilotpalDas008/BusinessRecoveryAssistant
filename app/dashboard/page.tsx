import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardSync } from "@/components/DashboardSync";
import { ReviewImportSection } from "@/components/ReviewImportSection";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { InsightsCard } from "@/components/InsightsCard";
import { CampaignTable } from "@/components/CampaignTable";
import { ReviewTable } from "@/components/ReviewTable";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  // Server-side authentication guard
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const ownerName = user?.firstName ? `${user.firstName}'s Business` : "ABC Restaurant";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Good Morning, {ownerName} 👋
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Business Health Overview</span>
              <span>•</span>
              <span>Here's what's happening with your business today.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-[#18181B] border border-[#27272A] text-zinc-300 font-mono inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync Active
            </span>
          </div>
        </div>

        {/* MongoDB Express Backend Sync Component */}
        <DashboardSync />
      </div>

      {/* Review Import Section */}
      <ReviewImportSection />

      {/* First Row: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Rating"
          value="4.6 ⭐"
          iconName="star"
          trend="+0.3 rating"
          trendType="positive"
          description="Based on 1,420 total reviews"
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-400"
        />
        <StatCard
          title="Reviews This Month"
          value="248"
          iconName="message"
          trend="+18%"
          trendType="positive"
          description="vs 210 reviews last month"
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-400"
        />
        <StatCard
          title="Negative Reviews"
          value="12"
          iconName="alert"
          trend="-22%"
          trendType="positive"
          description="Reduced from 16 last month"
          iconBgColor="bg-red-500/10"
          iconColor="text-red-400"
        />
        <StatCard
          title="AI Business Health Score"
          value="91%"
          iconName="shield"
          badgeText="Excellent"
          description="Top 5% local business retention"
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-400"
        />
      </div>

      {/* Second Row: Charts */}
      <ChartCard />

      {/* Third Row: AI Insights Card */}
      <InsightsCard />

      {/* Fourth Row: Recovery Campaigns Table */}
      <CampaignTable />

      {/* Fifth Row: Recent Reviews Table */}
      <ReviewTable />

      {/* Sixth Row: Business Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-400">Returning Customers</span>
            <div className="text-2xl font-bold text-white tracking-tight">1,420</div>
            <div className="text-[11px] text-emerald-400 font-medium inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +14% month-over-month
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="dashboard-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-400">Recovered Customers</span>
            <div className="text-2xl font-bold text-white tracking-tight">84</div>
            <div className="text-[11px] text-emerald-400 font-medium inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 85.7% recovery rate
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="dashboard-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-400">Revenue Saved</span>
            <div className="text-2xl font-bold text-white tracking-tight">$6,280</div>
            <div className="text-[11px] text-emerald-400 font-medium inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +$1,120 vs previous 30d
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
