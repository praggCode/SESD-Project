"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
const statusConfig = {
  TRIGGERED: {
    label: "Triggered",
    className: "bg-red-500/10 text-red-600 ring-1 ring-red-500/20 dark:text-red-400 dark:ring-red-400/20",
  },
  ACKNOWLEDGED: {
    label: "Acknowledged",
    className: "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400 dark:ring-amber-400/20",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-400/20",
  },
};
export function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status,
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
