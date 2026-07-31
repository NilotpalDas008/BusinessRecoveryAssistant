"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  Sparkles,
  Command,
  CheckCircle2,
} from "lucide-react";

interface TopNavbarProps {
  onSearch?: (query: string) => void;
}

export function TopNavbar({ onSearch }: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <header className="h-16 border-b border-[#27272A] bg-[#111113] px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3 w-60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-900/30">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Revive<span className="text-blue-500">AI</span>
          </span>
        </Link>
        <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded border border-[#27272A] bg-[#18181B] text-zinc-400 font-mono">
          v2.4
        </span>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Search reviews, complaints, campaigns, or customers..."
            className="w-full bg-[#18181B] border border-[#27272A] rounded-lg pl-9 pr-12 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-zinc-500 bg-[#27272A]/50 px-1.5 py-0.5 rounded font-mono">
            <Command className="h-3 w-3" /> K
          </div>
        </div>
      </div>

      {/* Right: Actions & Clerk UserButton */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button for mobile */}
        <button className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181B]">
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button
          onClick={() => setHasUnread(false)}
          className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181B] transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#111113]" />
          )}
        </button>

        {/* Help */}
        <button
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181B] transition-colors hidden sm:block"
          title="Help & Documentation"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Settings */}
        <Link
          href="#settings"
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181B] transition-colors hidden sm:block"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>

        <div className="h-4 w-[1px] bg-[#27272A] mx-1 hidden sm:block" />

        {/* Clerk User Button */}
        <div className="flex items-center pl-1">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 rounded-lg border border-[#27272A]",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
