"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserTable } from "@/components/users/user-table";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { toast } from "sonner";
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fetchTeams = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch teams", error);
      toast.error("Failed to load teams");
    }
  }, []);
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, [fetchTeams, fetchUsers]);
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Users
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage system users and access roles.
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="h-9 gap-1.5 rounded-lg font-medium text-sm"
          >
            <PlusIcon className="size-4" />
            Create User
          </Button>
        </div>
        <Card className="overflow-hidden rounded-xl border border-border/60 shadow-sm p-0">
          <UserTable
            users={users}
            teams={teams}
            loading={loading}
          />
        </Card>
      </main>
      <CreateUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={fetchUsers}
        teams={teams}
      />
    </div>
  );
}
