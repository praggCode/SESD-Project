"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const severityConfig = {
  CRITICAL: {
    label: "Critical",
    className: "bg-red-500/10 text-red-600 ring-1 ring-red-500/20 dark:text-red-400 dark:ring-red-400/20",
  },
  HIGH: {
    label: "High",
    className: "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20 dark:text-orange-400 dark:ring-orange-400/20",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400 dark:ring-amber-400/20",
  },
  LOW: {
    label: "Low",
    className: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-400/20",
  },
};

export function SeverityBadge({ severity }) {
  const config = severityConfig[severity] || {
    label: severity,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium text-[11px] tracking-wide uppercase",
        config.className
      )}
    >
      {config.label}
    </Badge>
  );
}
