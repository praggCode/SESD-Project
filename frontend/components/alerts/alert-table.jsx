"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/alerts/status-badge";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { ActionButtons } from "@/components/alerts/action-buttons";

/* ── Relative time helper ─────────────────────────────────── */
function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Loading skeleton rows ────────────────────────────────── */
function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-7 w-24 rounded-lg" /></TableCell>
    </TableRow>
  ));
}

/* ── Empty state ──────────────────────────────────────────── */
function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-40 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-3xl">🎉</span>
          <span className="text-sm font-medium">No alerts yet</span>
          <span className="text-xs text-muted-foreground/70">
            All clear! Trigger a new alert to get started.
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ── Main component ───────────────────────────────────────── */
export function AlertTable({ alerts, loading, onRefresh }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-4">Title</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="pr-4 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableSkeleton />
        ) : alerts.length === 0 ? (
          <EmptyState />
        ) : (
          alerts.map((alert) => (
            <TableRow
              key={alert._id}
              className="cursor-pointer transition-colors"
              onClick={() => router.push(`/alerts/${alert._id}`)}
            >
              <TableCell className="pl-4 font-medium text-foreground max-w-[240px] truncate">
                {alert.title}
              </TableCell>
              <TableCell>
                <SeverityBadge severity={alert.severity} />
              </TableCell>
              <TableCell>
                <StatusBadge status={alert.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {timeAgo(alert.createdAt)}
              </TableCell>
              <TableCell className="pr-4 text-right">
                <ActionButtons alert={alert} onActionComplete={onRefresh} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
