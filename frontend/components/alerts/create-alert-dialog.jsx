"use client";

import { useState, useEffect } from "react";
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

export function CreateAlertDialog({ open, onOpenChange, onCreated }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      async function fetchTeams() {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:7069/api/teams", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const fetchedTeams = data.data || [];
            setTeams(fetchedTeams);
            if (fetchedTeams.length > 0 && !teamId) {
              setTeamId(fetchedTeams[0]._id);
            }
          }
        } catch (error) {
          console.error("Failed to fetch teams", error);
        }
      }
      fetchTeams();
    }
  }, [open]);

  function resetForm() {
    setTitle("");
    setMessage("");
    setSeverity("MEDIUM");
    setTeamId(teams.length > 0 ? teams[0]._id : "");
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

          {/* Team Selection */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Team</Label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger className="h-9 w-full rounded-lg">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team._id} value={team._id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !teamId}>
              {loading ? "Creating…" : "Trigger Alert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
