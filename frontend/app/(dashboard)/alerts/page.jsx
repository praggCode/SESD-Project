"use client";

import { useState, useEffect, useCallback } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTable } from "@/components/alerts/alert-table";
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog";

const STATUS_TABS = ["All", "TRIGGERED", "ACKNOWLEDGED", "RESOLVED"];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  /* ── Fetch alerts ────────────────────────────────────────── */
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:7069/api/alerts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      const data = await res.json();
      setAlerts(data.data || data || []);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  /* ── Derived / filtered list ─────────────────────────────── */
  const filtered = alerts.filter((a) => {
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (severityFilter !== "All" && a.severity !== severityFilter) return false;
    return true;
  });

  /* ── Tab label helper ────────────────────────────────────── */
  function tabLabel(tab) {
    if (tab === "All") return "All";
    return tab.charAt(0) + tab.slice(1).toLowerCase();
  }

  function tabCount(tab) {
    if (tab === "All") return alerts.length;
    return alerts.filter((a) => a.status === tab).length;
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Alerts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor and manage security incidents in real time.
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="h-9 gap-1.5 rounded-lg font-medium text-sm"
          >
            <PlusIcon className="size-4" />
            Trigger Alert
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`
                  relative rounded-md px-3 py-1.5 text-xs font-medium transition-all
                  ${
                    statusFilter === tab
                      ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {tabLabel(tab)}
                <span
                  className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none
                    ${
                      statusFilter === tab
                        ? "bg-foreground/10 text-foreground"
                        : "bg-transparent text-muted-foreground/70"
                    }
                  `}
                >
                  {tabCount(tab)}
                </span>
              </button>
            ))}
          </div>

          {/* Severity filter */}
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-8 w-[160px] rounded-lg text-xs">
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All severities</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table card */}
        <Card className="overflow-hidden rounded-xl border border-border/60 shadow-sm p-0">
          <AlertTable
            alerts={filtered}
            loading={loading}
            onRefresh={fetchAlerts}
          />
        </Card>
      </main>

      {/* Create alert dialog */}
      <CreateAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={fetchAlerts}
      />
    </div>
  );
}

