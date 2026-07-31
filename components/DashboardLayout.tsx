"use client";

import { useState, ReactNode } from "react";
import { TopNavbar } from "./TopNavbar";
import { Sidebar } from "./Sidebar";
import { AIAssistant } from "./AIAssistant";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 selection:bg-blue-500/30 selection:text-blue-200 flex flex-col font-sans">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 pb-24">
          {children}
        </main>
      </div>

      {/* Floating Right AI Advisor Panel */}
      <AIAssistant />
    </div>
  );
}
