"use client";

import { useState } from "react";
import { Zap, ArrowUpRight, Play, CheckCircle2, PauseCircle } from "lucide-react";

export function CampaignTable() {
  const [campaigns] = useState([
    {
      id: 1,
      campaign: "Weekend Coupon (REVIVE20)",
      target: "Food Complaints",
      status: "Running",
      statusBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      recoveryRate: "38%",
      recoveredCount: "12 saved / 32 contacted",
      channel: "WhatsApp",
    },
    {
      id: 2,
      campaign: "Service Apology Voucher",
      target: "Late Delivery",
      status: "Completed",
      statusBadge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      recoveryRate: "52%",
      recoveredCount: "26 saved / 50 contacted",
      channel: "SMS & WhatsApp",
    },
    {
      id: 3,
      campaign: "VIP Recovery Offer",
      target: "Staff Behaviour",
      status: "Active",
      statusBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      recoveryRate: "61%",
      recoveredCount: "19 saved / 31 contacted",
      channel: "WhatsApp",
    },
    {
      id: 4,
      campaign: "Lunch Retargeting Pass",
      target: "Wait Time",
      status: "Paused",
      statusBadge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      recoveryRate: "44%",
      recoveredCount: "11 saved / 25 contacted",
      channel: "WhatsApp",
    },
  ]);

  return (
    <div className="dashboard-card p-6 border border-[#27272A]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Recovery Campaigns</h3>
            <p className="text-xs text-zinc-400">Automated WhatsApp & multi-channel customer retention campaigns</p>
          </div>
        </div>

        <button className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors">
          <Play className="h-3.5 w-3.5 fill-current" /> Create Campaign
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#111113] text-zinc-400 uppercase tracking-wider font-mono text-[11px] border-y border-[#27272A]">
            <tr>
              <th className="py-3 px-4 font-semibold">Campaign Name</th>
              <th className="py-3 px-4 font-semibold">Target Audience</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Recovery Rate</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]">
            {campaigns.map((row) => (
              <tr key={row.id} className="hover:bg-[#111113]/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white">{row.campaign}</div>
                  <div className="text-[11px] text-zinc-500">Channel: {row.channel}</div>
                </td>
                <td className="py-3.5 px-4 font-medium text-zinc-300">{row.target}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium border ${row.statusBadge}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{row.recoveryRate}</span>
                    <span className="text-[11px] text-zinc-500">({row.recoveredCount})</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="px-2.5 py-1 rounded bg-[#27272A] hover:bg-[#3f3f46] text-zinc-200 hover:text-white text-xs font-medium inline-flex items-center gap-1 transition-colors">
                    View <ArrowUpRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
