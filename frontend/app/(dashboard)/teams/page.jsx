"use client";

import { useEffect, useState, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash2Icon, UsersIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  // Delete state
  const [deletingId, setDeletingId] = useState(null);

  const fetchTeams = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:7069/api/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      
      // Ensure array, APIs generally wrap in { data: ... } or return array directly
      setTeams(data.data || data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    
    setIsCreating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:7069/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newTeamName.trim() }),
      });
      
      if (!res.ok) throw new Error("Failed to create team");
      
      toast.success("Team created");
      setNewTeamName("");
      setIsDialogOpen(false);
      fetchTeams();
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:7069/api/teams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to delete team");
      
      toast.success("Team deleted");
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 max-w-6xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Teams
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Manage your organization's teams and their respective incidents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            size="sm"
            className="w-fit h-9 px-4 rounded-md shadow-sm transition-all hover:shadow-md"
            disabled={isLoading}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="rounded-xl border border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="flex-1 px-6 pb-6 pt-0">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
              All Teams
            </CardTitle>
            <CardDescription className="text-sm">
              View and manage all registered teams in Sentinel.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 px-1 sm:px-6 pb-6 pt-0">
            {teams.length === 0 ? (
              <div className="flex flex-col h-[300px] items-center justify-center text-center text-muted-foreground rounded-lg border border-dashed border-border/60 bg-muted/10 mx-5 sm:mx-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-base font-medium text-foreground">No teams yet</p>
                <p className="text-sm mt-1 max-w-[250px] leading-relaxed">
                  You haven't created any teams. Create your first team to start assigning incidents.
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="mt-6"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-border/60 overflow-hidden mx-5 sm:mx-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-5 font-medium">Team Name</TableHead>
                      <TableHead className="font-medium">Created At</TableHead>
                      <TableHead className="text-right pr-5 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow 
                        key={team._id || team.id}
                        className="group hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="pl-5 py-4">
                          <span className="font-medium text-foreground block">
                            {team.name}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-muted-foreground text-sm font-medium">
                            {formatTime(team.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-5 py-3">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            onClick={() => handleDeleteTeam(team._id || team.id)}
                            disabled={deletingId === (team._id || team.id)}
                            title="Delete team"
                          >
                            {deletingId === (team._id || team.id) ? (
                              <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2Icon className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* CREATE TEAM DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              Add a new team to your Sentinel organization. 
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTeam}>
            <div className="grid gap-4 py-4 mt-2">
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-medium">
                  Team Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Engineering, Security Response..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  disabled={isCreating}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="mt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !newTeamName.trim()}>
                {isCreating ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Team"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
