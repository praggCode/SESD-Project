"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/alerts/status-badge";
import { SeverityBadge } from "@/components/alerts/severity-badge";
function timeAgo(dateInput) {
  if (!dateInput) return "—";
  const now = Date.now();
  const then = new Date(dateInput).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
function exactTime(dateInput) {
  if (!dateInput) return "—";
  return new Date(dateInput).toLocaleString();
}
function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
        <div className="md:col-span-1">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
export default function AlertDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAlertData();
  }, [id]);
  async function fetchAlertData() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/alerts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load alert details");
      const data = await res.json();
      setAlert(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleAction(action) {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/alerts/${id}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${action} alert`);
      }
      toast.success(
        action === "acknowledge" ? "Alert acknowledged" : "Alert resolved",
        { duration: 3000 }
      );
      fetchAlertData();
    } catch (err) {
      toast.error("Action failed", {
        description: err.message,
        duration: 5000,
      });
    } finally {
      setActionLoading(false);
    }
  }
  if (loading) return <DetailSkeleton />;
  if (error || !alert) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Uh oh!</h2>
        <p className="text-muted-foreground mb-6">{error || "Alert not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/alerts">Return to Alerts</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 flex flex-col gap-8">
      <Link
        href="/alerts"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <ArrowLeftIcon className="size-4" />
        Back to Alerts
      </Link>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {alert.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <SeverityBadge severity={alert.severity} />
          <StatusBadge status={alert.status} />
          <span className="text-sm text-muted-foreground ml-2 flex items-center gap-1.5">
            <ClockIcon className="size-4" />
            {timeAgo(alert.createdAt)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle>Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-muted-foreground">Message</span>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {alert.message}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Source
                  </span>
                  <span className="text-sm font-medium">{alert.source}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Team
                  </span>
                  <span className="text-sm font-medium">
                    {alert.teamId?.name || "Unknown Team"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {(alert.status === "TRIGGERED" || alert.status === "ACKNOWLEDGED") && (
            <Card className="shadow-sm border-dashed">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Response Actions</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Take ownership or resolve this incident.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {alert.status === "TRIGGERED" && (
                    <Button 
                      onClick={() => handleAction("acknowledge")} 
                      disabled={actionLoading}
                      className="w-full sm:w-auto"
                    >
                      {actionLoading ? "Working…" : "Acknowledge Alert"}
                    </Button>
                  )}
                  {alert.status === "ACKNOWLEDGED" && (
                    <Button 
                      onClick={() => handleAction("resolve")} 
                      disabled={actionLoading}
                      className="w-full sm:w-auto"
                    >
                      {actionLoading ? "Working…" : "Resolve Alert"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l border-border/80 ml-3 flex flex-col gap-6 pl-6">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 flex size-[11px] items-center justify-center rounded-full bg-foreground ring-4 ring-background"></span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Triggered</span>
                    <span className="text-xs text-muted-foreground">
                      {exactTime(alert.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <span className={`absolute -left-[31px] top-1 flex size-[11px] items-center justify-center rounded-full ring-4 ring-background transition-colors ${alert.acknowledgedAt ? "bg-amber-500" : "bg-muted border border-border"}`}></span>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-sm font-medium ${!alert.acknowledgedAt && "text-muted-foreground"}`}>Acknowledged</span>
                    <span className="text-xs text-muted-foreground">
                      {alert.acknowledgedAt ? exactTime(alert.acknowledgedAt) : "Pending..."}
                    </span>
                     {alert.acknowledgedBy && (
                      <span className="text-xs text-muted-foreground mt-0.5">
                        by {alert.acknowledgedBy.name || alert.acknowledgedBy.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <span className={`absolute -left-[31px] top-1 flex size-[11px] items-center justify-center rounded-full ring-4 ring-background transition-colors ${alert.resolvedAt ? "bg-emerald-500" : "bg-muted border border-border"}`}></span>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-sm font-medium ${!alert.resolvedAt && "text-muted-foreground"}`}>Resolved</span>
                    <span className="text-xs text-muted-foreground">
                       {alert.resolvedAt ? exactTime(alert.resolvedAt) : "Pending..."}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
