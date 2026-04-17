"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, CheckCircleIcon, ShieldCheckIcon, EyeIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function ActionButtons({ alert, onActionComplete }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleAction(action) {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/alerts/${alert._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${action} alert.`);
      }
      toast.success(
        action === "acknowledge" ? "Alert acknowledged" : "Alert resolved",
        { duration: 3000 }
      );
      onActionComplete?.();
    } catch (err) {
      toast.error("Action failed", {
        description: err.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()} 
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/alerts/${alert._id}`);
          }}
          className="cursor-pointer"
        >
          <EyeIcon className="mr-2" />
          View Details
        </DropdownMenuItem>
        {alert.status === "TRIGGERED" && (
          <DropdownMenuItem
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              handleAction("acknowledge");
            }}
            className="cursor-pointer text-amber-600 focus:text-amber-600 dark:text-amber-400 dark:focus:text-amber-400"
          >
            <ShieldCheckIcon className="mr-2" />
            {loading ? "Working…" : "Acknowledge"}
          </DropdownMenuItem>
        )}
        {alert.status === "ACKNOWLEDGED" && (
          <DropdownMenuItem
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              handleAction("resolve");
            }}
            className="cursor-pointer text-emerald-600 focus:text-emerald-600 dark:text-emerald-400 dark:focus:text-emerald-400"
          >
            <CheckCircleIcon className="mr-2" />
            {loading ? "Working…" : "Resolve"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
