"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/alerts/status-badge";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  BellRing,
  RefreshCw,
  ArrowRight
} from "lucide-react";
export default function DashboardPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fetchAlerts = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAlerts(data.data || data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setAlerts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(() => {
      fetchAlerts();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);
  const totalAlerts = alerts.length;
  const triggeredAlerts = alerts.filter((a) => a.status === "TRIGGERED").length;
  const acknowledgedAlerts = alerts.filter((a) => a.status === "ACKNOWLEDGED").length;
  const resolvedAlerts = alerts.filter((a) => a.status === "RESOLVED").length;
  const severityCounts = {
    CRITICAL: alerts.filter((a) => a.severity === "CRITICAL").length,
    HIGH: alerts.filter((a) => a.severity === "HIGH").length,
    MEDIUM: alerts.filter((a) => a.severity === "MEDIUM").length,
    LOW: alerts.filter((a) => a.severity === "LOW").length,
  };
  const recentAlerts = [...alerts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            A comprehensive view of your active security alerts and system health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchAlerts(true)}
            disabled={isLoading || isRefreshing}
            className="w-fit h-9 px-4 rounded-md shadow-sm transition-all hover:bg-muted/50 hover:shadow-md"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
            Refresh Data
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[140px] rounded-xl" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-[360px] md:col-span-1 rounded-xl" />
            <Skeleton className="h-[360px] md:col-span-2 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Alerts
                </CardTitle>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                  <BellRing className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold tracking-tight text-foreground mt-2">
                  {totalAlerts}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-red-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Triggered
                </CardTitle>
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center transition-transform hover:scale-110">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold tracking-tight text-foreground mt-2">
                  {triggeredAlerts}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-amber-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Acknowledged
                </CardTitle>
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center transition-transform hover:scale-110">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold tracking-tight text-foreground mt-2">
                  {acknowledgedAlerts}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Resolved
                </CardTitle>
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center transition-transform hover:scale-110">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold tracking-tight text-foreground mt-2">
                  {resolvedAlerts}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 rounded-xl border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80 flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                  Severity Breakdown
                </CardTitle>
                <CardDescription className="text-sm">
                  Active incidents sorted by impact level.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-3">
                  {(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).map((sev) => (
                    <div 
                      key={sev} 
                      className="group flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/60 transition-all duration-200 cursor-default"
                    >
                      <SeverityBadge severity={sev} />
                      <span className="font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
                        {severityCounts[sev] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 rounded-xl border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80 flex flex-col">
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    The latest 5 alerts requiring attention.
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground font-medium text-xs hidden sm:flex h-8 px-3 rounded-md"
                  onClick={() => router.push('/alerts')}
                >
                  View All
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 px-1 sm:px-6 pb-6 pt-0">
                {recentAlerts.length === 0 ? (
                  <div className="flex flex-col h-full min-h-[220px] items-center justify-center text-center text-muted-foreground rounded-lg border border-dashed border-border/60 bg-muted/10 mx-5 sm:mx-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <ShieldAlert className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-base font-medium text-foreground">System Secure 🎉</p>
                    <p className="text-sm mt-1 max-w-[250px]">No active incidents detected. You are completely caught up.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border/60 overflow-hidden mx-5 sm:mx-0">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="pl-5 font-medium">Alert Title</TableHead>
                          <TableHead className="font-medium">Severity</TableHead>
                          <TableHead className="font-medium">Status</TableHead>
                          <TableHead className="text-right pr-5 font-medium">Logged At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentAlerts.map((alert) => (
                          <TableRow 
                            key={alert._id || alert.id}
                            className="group cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => router.push(`/alerts/${alert._id || alert.id}`)}
                          >
                            <TableCell className="pl-5 py-4">
                              <span className="font-medium text-foreground group-hover:text-primary transition-colors max-w-[150px] sm:max-w-[220px] truncate block">
                                {alert.title}
                              </span>
                            </TableCell>
                            <TableCell className="py-4">
                              <SeverityBadge severity={alert.severity} />
                            </TableCell>
                            <TableCell className="py-4">
                              <StatusBadge status={alert.status} />
                            </TableCell>
                            <TableCell className="text-right pr-5 py-4 text-muted-foreground text-xs whitespace-nowrap font-medium">
                              {formatTime(alert.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
