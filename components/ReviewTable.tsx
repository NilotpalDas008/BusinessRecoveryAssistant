"use client";

import { useState } from "react";
import { Star, MessageSquareText, Filter, Eye, Send, CheckCircle2, X } from "lucide-react";

export interface ReviewItem {
  id: string;
  customer: string;
  avatar: string;
  rating: number;
  complaint: string;
  sentiment: "Negative" | "Positive" | "Neutral";
  status: "Pending Action" | "Voucher Sent" | "Resolved";
  date: string;
  channel: string;
}

export function ReviewTable() {
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [filter, setFilter] = useState<"All" | "Negative" | "Positive">("All");

  const reviews: ReviewItem[] = [
    {
      id: "REV-108",
      customer: "Marcus Vance",
      avatar: "MV",
      rating: 2,
      complaint: "Waited 45 minutes for pasta order during lunch rush.",
      sentiment: "Negative",
      status: "Pending Action",
      date: "Today, 1:15 PM",
      channel: "Google Review",
    },
    {
      id: "REV-107",
      customer: "Sarah Jenkins",
      avatar: "SJ",
      rating: 5,
      complaint: "Outstanding coffee and dessert. Staff was exceptionally attentive!",
      sentiment: "Positive",
      status: "Resolved",
      date: "Today, 11:40 AM",
      channel: "Google Review",
    },
    {
      id: "REV-106",
      customer: "David Miller",
      avatar: "DM",
      rating: 1,
      complaint: "Food was cold when delivered, order missing extra sauce.",
      sentiment: "Negative",
      status: "Voucher Sent",
      date: "Yesterday",
      channel: "Uber Eats",
    },
    {
      id: "REV-105",
      customer: "Elena Rostova",
      avatar: "ER",
      rating: 4,
      complaint: "Great atmosphere and wine selection. A bit noisy near the bar.",
      sentiment: "Positive",
      status: "Resolved",
      date: "2 days ago",
      channel: "Google Review",
    },
  ];

  const filteredReviews = reviews.filter((r) => {
    if (filter === "Negative") return r.sentiment === "Negative";
    if (filter === "Positive") return r.sentiment === "Positive";
    return true;
  });

  return (
    <div className="dashboard-card p-6 border border-[#27272A] relative">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Recent Customer Reviews</h3>
            <p className="text-xs text-zinc-400">Ingested feedback from Google Reviews and delivery channels</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#111113] p-1 rounded-lg border border-[#27272A] text-xs">
          <Filter className="h-3.5 w-3.5 text-zinc-500 ml-1.5" />
          <button
            onClick={() => setFilter("All")}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === "All" ? "bg-blue-600 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Negative")}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === "Negative" ? "bg-red-600 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            Negative (12)
          </button>
          <button
            onClick={() => setFilter("Positive")}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === "Positive" ? "bg-emerald-600 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            Positive (236)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#111113] text-zinc-400 uppercase tracking-wider font-mono text-[11px] border-y border-[#27272A]">
            <tr>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Rating</th>
              <th className="py-3 px-4 font-semibold">Complaint / Feedback</th>
              <th className="py-3 px-4 font-semibold">Sentiment</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]">
            {filteredReviews.map((row) => (
              <tr key={row.id} className="hover:bg-[#111113]/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center text-xs">
                      {row.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{row.customer}</div>
                      <div className="text-[11px] text-zinc-500">{row.channel} • {row.date}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 font-semibold text-white">
                    <span>{row.rating}.0</span>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </div>
                </td>
                <td className="py-3.5 px-4 max-w-xs truncate text-zinc-300">
                  {row.complaint}
                </td>
                <td className="py-3.5 px-4">
                  {row.sentiment === "Negative" ? (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                      Negative
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Positive
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-zinc-400 font-medium">
                  {row.status}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedReview(row)}
                    className="px-2.5 py-1 rounded bg-[#27272A] hover:bg-[#3f3f46] text-zinc-200 hover:text-white text-xs font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-300 font-bold flex items-center justify-center text-xs border border-blue-500/30">
                  {selectedReview.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedReview.customer}</h4>
                  <p className="text-[11px] text-zinc-400">{selectedReview.channel} • {selectedReview.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Rating:</span>
                <span className="font-bold text-amber-400">{selectedReview.rating}.0 / 5.0 ⭐</span>
              </div>
              <div className="p-3 bg-[#111113] rounded-lg border border-[#27272A] text-zinc-200 leading-relaxed">
                "{selectedReview.complaint}"
              </div>
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-2 text-xs">
              <span className="font-semibold text-emerald-400">AI Recovery Action Suggested:</span>
              <p className="text-emerald-100 font-sans">
                "Hi {selectedReview.customer}, we're super sorry about your recent experience. We've attached a 20% OFF voucher (REVIVE20) for your next visit!"
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 rounded-lg bg-[#27272A] hover:bg-[#3f3f46] text-xs font-semibold text-zinc-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Dispatched recovery campaign to ${selectedReview.customer}!`);
                  setSelectedReview(null);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white inline-flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" /> Dispatch Recovery Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
