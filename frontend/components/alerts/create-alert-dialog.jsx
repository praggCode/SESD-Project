"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_TEAM_ID = "69de10736e0f0d4e82cf8a9c";

export function CreateAlertDialog({ open, onOpenChange, onCreated }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [teamId, setTeamId] = useState(DEFAULT_TEAM_ID);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setTitle("");
    setMessage("");
    setSeverity("MEDIUM");
    setTeamId(DEFAULT_TEAM_ID);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:7069/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          message,
          severity,
          source: "uptime-monitor",
          teamId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create alert.");
      }

      toast.success("Alert created", {
        description: `"${title}" has been triggered.`,
        duration: 3000,
      });
      resetForm();
      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      toast.error("Failed to create alert", {
        description: err.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trigger Alert</DialogTitle>
          <DialogDescription>
            Create a new alert incident for your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alert-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="alert-title"
              type="text"
              placeholder="Server CPU usage exceeded 90%"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 rounded-lg"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alert-message" className="text-sm font-medium">
              Message
            </Label>
            <Input
              id="alert-message"
              type="text"
              placeholder="Describe the incident..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-9 rounded-lg"
            />
          </div>

          {/* Severity */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="h-9 w-full rounded-lg">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team ID */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alert-team" className="text-sm font-medium">
              Team ID
            </Label>
            <Input
              id="alert-team"
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="h-9 rounded-lg"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Trigger Alert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
