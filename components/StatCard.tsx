"use client";

import {
  Star,
  MessageSquareText,
  AlertTriangle,
  ShieldCheck,
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  LucideIcon,
} from "lucide-react";

export type IconName =
  | "star"
  | "message"
  | "alert"
  | "shield"
  | "users"
  | "userCheck"
  | "dollar";

const iconMap: Record<IconName, LucideIcon> = {
  star: Star,
  message: MessageSquareText,
  alert: AlertTriangle,
  shield: ShieldCheck,
  users: Users,
  userCheck: UserCheck,
  dollar: DollarSign,
};

export interface StatCardProps {
  title: string;
  value: string | number;
  iconName: IconName;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  description: string;
  badgeText?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  iconName,
  trend,
  trendType = "positive",
  description,
  badgeText,
  iconBgColor = "bg-blue-500/10",
  iconColor = "text-blue-400",
}: StatCardProps) {
  const Icon = iconMap[iconName] || Star;

  return (
    <div className="dashboard-card p-5 hover:border-[#3f3f46] transition-all duration-200 flex flex-col justify-between">
      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-zinc-400">{title}</span>
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>

      {/* Value & Trend Row */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            {value}
          </span>

          {badgeText && (
            <span className="text-xs px-2 py-0.5 rounded font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {badgeText}
            </span>
          )}
        </div>

        {/* Trend Indicator & Sub-description */}
        <div className="flex items-center justify-between text-xs pt-1">
          {trend && (
            <div
              className={`inline-flex items-center gap-1 font-medium ${
                trendType === "positive"
                  ? "text-emerald-400"
                  : trendType === "negative"
                  ? "text-red-400"
                  : "text-zinc-400"
              }`}
            >
              {trendType === "positive" ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : trendType === "negative" ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : null}
              <span>{trend}</span>
            </div>
          )}

          <span className="text-zinc-500 text-[11px] truncate">{description}</span>
        </div>
      </div>
    </div>
  );
}
