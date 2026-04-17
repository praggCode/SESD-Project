"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { 
  GitBranchIcon, 
  PlusIcon,
  ArrowRightIcon,
  SearchXIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PolicyFormDialog } from "@/components/escalation/policy-form-dialog";
import { Skeleton } from "@/components/ui/skeleton";
export default function EscalationPage() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [policy, setPolicy] = useState(null);
  const [loadingPolicy, setLoadingPolicy] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fetchInitialData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const [resTeams, resUsers] = await Promise.all([
        axios.get(`${API_URL}/teams`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setTeams(resTeams.data?.data || []);
      setUsers(resUsers.data?.data || []);
    } catch {
      toast.error("Failed to load initial data (teams/users)");
    } finally {
      setLoadingTeams(false);
    }
  }, []);
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  const fetchPolicy = useCallback(async (teamId) => {
    if (!teamId) return;
    setLoadingPolicy(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/escalation-policies/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPolicy(res.data?.data || null);
    } catch (error) {
      if (error.response?.status === 404) {
        setPolicy(null); 
      } else {
        toast.error("Failed to load team policy");
      }
    } finally {
      setLoadingPolicy(false);
    }
  }, []);
  useEffect(() => {
    if (selectedTeamId) {
      fetchPolicy(selectedTeamId);
    } else {
      setPolicy(null);
    }
  }, [selectedTeamId, fetchPolicy]);
  const getUserName = (id) => {
    const user = users.find(u => u._id === id);
    return user ? user.name : "Unknown User";
  };
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <GitBranchIcon className="size-6 text-muted-foreground" />
              Escalation Policies
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure automated incident routing paths and delays.
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="h-9 gap-1.5 rounded-lg font-medium text-sm"
            disabled={!selectedTeamId || loadingTeams}
          >
            <PlusIcon className="size-4" />
            {policy ? 'Update Policy' : 'Create Policy'}
          </Button>
        </div>
        <div className="mb-6 max-w-sm">
          <label className="text-sm font-medium mb-1.5 block text-foreground">Select Team</label>
          <Select 
            value={selectedTeamId}
            onValueChange={setSelectedTeamId}
            disabled={loadingTeams}
          >
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder={loadingTeams ? "Loading teams..." : "Choose a team..."} />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team._id} value={team._id}>{team.name}</SelectItem>
              ))}
              {teams.length === 0 && !loadingTeams && (
                <SelectItem value="none" disabled>No teams found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <Card className="rounded-xl border border-border/60 shadow-sm p-6 min-h-[400px]">
          {!selectedTeamId ? (
            <div className="h-full w-full flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="rounded-full bg-muted p-4 mb-4">
                <GitBranchIcon className="size-8" />
              </div>
              <p>Select a team from the dropdown to view or configure its policy.</p>
            </div>
          ) : loadingPolicy ? (
            <div className="space-y-6 max-w-2xl mx-auto py-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : !policy ? (
            <div className="h-full w-full flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="rounded-full bg-muted p-4 mb-4">
                <SearchXIcon className="size-8" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No Policy Configured</h3>
              <p className="mb-6">This team does not have an active escalation policy.</p>
              <Button onClick={() => setDialogOpen(true)} variant="outline">
                Create Policy
              </Button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-8 space-y-6 relative">
              <div className="absolute top-8 bottom-8 left-8 w-0.5 bg-border -z-10" />
              {policy.levels.map((lvl, idx) => (
                <div key={idx} className="flex gap-6 relative group">
                  <div className="flex flex-col items-center">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-muted text-foreground shadow-sm group-hover:border-primary/20 transition-colors">
                      <span className="font-semibold px-2 text-center text-xs">Lvl {lvl.levelNumber}</span>
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border bg-card p-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        Escalation Level {lvl.levelNumber}
                      </h4>
                      <Badge variant="outline" className="text-muted-foreground font-mono">
                        +{lvl.delayMinutes} min delay
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3 text-transform: uppercase tracking-wider">
                        Assigned Responders
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {lvl.userIds.map(userId => (
                          <Badge key={userId} variant="secondary" className="px-2.5 py-1 text-sm font-medium">
                            {getUserName(userId)}
                          </Badge>
                        ))}
                        {lvl.userIds.length === 0 && (
                          <span className="text-sm text-muted-foreground italic">No users mapped</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
      <PolicyFormDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teamId={selectedTeamId}
        existingPolicy={policy}
        users={users}
        onSaved={() => fetchPolicy(selectedTeamId)}
      />
    </div>
  );
}
