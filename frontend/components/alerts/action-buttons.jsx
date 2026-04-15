"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ActionButtons({ alert, onActionComplete }) {
  const [loading, setLoading] = useState(false);

  async function handleAction(action) {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:7069/api/alerts/${alert._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${action} alert.`);
      }

      toast.success(
        action === "acknowledge" ? "Alert acknowledged" : "Alert resolved",
        { duration: 3000 }
      );
      onActionComplete?.();
    } catch (err) {
      toast.error("Action failed", {
        description: err.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  if (alert.status === "TRIGGERED") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation();
          handleAction("acknowledge");
        }}
        className="text-amber-600 border-amber-500/30 hover:bg-amber-500/10 dark:text-amber-400"
      >
        {loading ? "Working…" : "Acknowledge"}
      </Button>
    );
  }

  if (alert.status === "ACKNOWLEDGED") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation();
          handleAction("resolve");
        }}
        className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 dark:text-emerald-400"
      >
        {loading ? "Working…" : "Resolve"}
      </Button>
    );
  }

  // RESOLVED — no action
  return (
    <span className="text-xs text-muted-foreground/60 italic">No action</span>
  );
}
