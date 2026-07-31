"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "./ui/badge";
import { CheckCircle2, Loader2, Database, Mail, AlertCircle, RefreshCw } from "lucide-react";

interface BusinessOwnerData {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export function DashboardSync() {
  const { user, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [businessOwner, setBusinessOwner] = useState<BusinessOwnerData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const primaryEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress;

  const syncUserWithBackend = async (email: string) => {
    setSyncStatus("loading");
    setErrorMsg(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/business-owner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBusinessOwner(data.businessOwner);
        setSyncStatus("success");
      } else {
        throw new Error(data.error || "Failed to sync user with backend");
      }
    } catch (err: any) {
      console.error("[DashboardSync] Error:", err);
      setErrorMsg(err.message || "Failed to connect to backend server");
      setSyncStatus("error");
    }
  };

  useEffect(() => {
    if (isLoaded && primaryEmail) {
      syncUserWithBackend(primaryEmail);
    }
  }, [isLoaded, primaryEmail]);

  if (!isLoaded) {
    return (
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121216]/80 flex items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
        <span>Loading authentication session...</span>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#121216]/90 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">MongoDB Backend Account Sync</h3>
        </div>
        <Badge variant={syncStatus === "success" ? "emerald" : syncStatus === "loading" ? "amber" : "purple"}>
          {syncStatus === "success" && "Database Synced"}
          {syncStatus === "loading" && "Syncing Email..."}
          {syncStatus === "error" && "Sync Warning"}
          {syncStatus === "idle" && "Initializing"}
        </Badge>
      </div>

      {syncStatus === "loading" && (
        <div className="flex items-center gap-3 text-sm text-zinc-300 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
          <span>Sending POST request to <code>/api/business-owner</code>...</span>
        </div>
      )}

      {syncStatus === "success" && businessOwner && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            <span>BusinessOwner document verified in MongoDB:</span>
          </div>

          <div className="bg-[#07070a] p-4 rounded-xl border border-white/[0.08] font-mono space-y-1.5 text-zinc-300">
            <div>
              <span className="text-purple-400">_id:</span> {businessOwner._id}
            </div>
            <div>
              <span className="text-purple-400">email:</span> {businessOwner.email}
            </div>
            <div>
              <span className="text-purple-400">createdAt:</span> {new Date(businessOwner.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="text-purple-400">updatedAt:</span> {new Date(businessOwner.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {syncStatus === "error" && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <AlertCircle className="h-4 w-4" />
            <span>Sync Alert: {errorMsg}</span>
          </div>
          <p className="text-zinc-400">
            Ensure your Express backend server is running on <code>http://localhost:5000</code> and MongoDB is connected.
          </p>
          <button
            onClick={() => primaryEmail && syncUserWithBackend(primaryEmail)}
            className="mt-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> Retry Sync
          </button>
        </div>
      )}
    </div>
  );
}
