"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Filter, PieChart as PieIcon } from "lucide-react";

// Dummy 30-day review volume data
const reviewTrendData = [
  { day: "Jul 01", reviews: 14, rating: 4.5 },
  { day: "Jul 05", reviews: 18, rating: 4.6 },
  { day: "Jul 10", reviews: 22, rating: 4.4 },
  { day: "Jul 15", reviews: 28, rating: 4.7 },
  { day: "Jul 20", reviews: 31, rating: 4.8 },
  { day: "Jul 25", reviews: 25, rating: 4.6 },
  { day: "Jul 30", reviews: 36, rating: 4.9 },
];

// Complaint categories data
const complaintData = [
  { name: "Food Quality / Temp", value: 42, color: "#3B82F6", count: "18 reviews" },
  { name: "Late Delivery / Wait", value: 24, color: "#F59E0B", count: "10 reviews" },
  { name: "Staff Behaviour", value: 18, color: "#EF4444", count: "8 reviews" },
  { name: "Pricing Transparency", value: 16, color: "#8B5CF6", count: "7 reviews" },
];

export function ChartCard() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Review Trend Area Chart (8 cols) */}
      <div className="lg:col-span-8 dashboard-card p-6 flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Review Volume & Rating Trend</h3>
            <p className="text-xs text-zinc-400">Total customer reviews and average rating score over time</p>
          </div>

          <div className="flex items-center gap-2 bg-[#111113] p-1 rounded-lg border border-[#27272A] text-xs">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeRange === "7d" ? "bg-blue-600 text-white font-medium" : "text-zinc-400 hover:text-white"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeRange === "30d" ? "bg-blue-600 text-white font-medium" : "text-zinc-400 hover:text-white"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange("90d")}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeRange === "90d" ? "bg-blue-600 text-white font-medium" : "text-zinc-400 hover:text-white"
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reviewTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
              <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181B",
                  borderColor: "#27272A",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#F4F4F5",
                }}
                itemStyle={{ color: "#3B82F6" }}
              />
              <Area
                type="monotone"
                dataKey="reviews"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorReviews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right: Complaint Breakdown Pie Chart (4 cols) */}
      <div className="lg:col-span-4 dashboard-card p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Complaint Breakdown</h3>
            <p className="text-xs text-zinc-400">Recurring customer issue categories</p>
          </div>
          <PieIcon className="h-4 w-4 text-zinc-400" />
        </div>

        {/* Pie Chart */}
        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={complaintData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {complaintData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181B",
                  borderColor: "#27272A",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#F4F4F5",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#27272A]">
          {complaintData.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <div className="truncate">
                <div className="text-zinc-200 font-medium truncate">{item.name}</div>
                <div className="text-[10px] text-zinc-500">{item.value}% ({item.count})</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
