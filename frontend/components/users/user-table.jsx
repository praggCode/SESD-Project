"use client";
import { AlertCircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
export function UserTable({ users, teams, loading }) {
  const getTeamName = (teamId) => {
    if (!teamId) return "Unassigned";
    const id = typeof teamId === "object" && teamId !== null ? teamId._id : teamId;
    const team = teams.find((t) => t._id === id);
    return team ? team.name : "Unknown Team";
  };
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "ADMIN":
        return "destructive"; 
      case "RESPONDER":
      default:
        return "secondary";
    }
  };
  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[80px] rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <AlertCircleIcon className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-semibold">No users found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          There are currently no users in the system.
        </p>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium text-foreground">
              {user.name}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {user.email}
            </TableCell>
            <TableCell>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {getTeamName(user.teamId)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              <span title={new Date(user.createdAt).toLocaleString()}>
                {user.createdAt
                  ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
                  : "N/A"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
