"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  Users,
  Zap,
  Share2,
  FileSpreadsheet,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Reviews", icon: MessageSquareText, href: "/dashboard#reviews", badge: "12 New" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Customers", icon: Users, href: "/dashboard#customers" },
    { name: "Recovery Campaigns", icon: Zap, href: "/dashboard#campaigns", badge: "Active" },
    { name: "Marketing", icon: Share2, href: "/dashboard#marketing" },
    { name: "Reports", icon: FileSpreadsheet, href: "/dashboard#reports" },
    { name: "Integrations", icon: Plug, href: "/dashboard#integrations" },
    { name: "Settings", icon: Settings, href: "/dashboard#settings" },
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] bg-[#111113] border-r border-[#27272A] flex flex-col justify-between transition-all duration-300 sticky top-16 z-30 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Navigation Items */}
      <div className="py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (activeTab && activeTab === item.name);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onTabChange?.(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors relative group ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#18181B]"
              }`}
              title={collapsed ? item.name : undefined}
            >
              {/* Blue indicator for active tab */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r" />
              )}

              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-400" : "text-zinc-400"}`} />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.name}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    item.badge === "12 New"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Collapse Toggle Button */}
      <div className="p-3 border-t border-[#27272A] flex items-center justify-between">
        {!collapsed && (
          <div className="text-[11px] text-zinc-500 px-2 font-mono">
            ReviveAI Engine • Ready
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181B] transition-colors ml-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
