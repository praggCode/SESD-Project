"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon, TrashIcon, XIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function PolicyFormDialog({ open, onOpenChange, teamId, existingPolicy, users, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);

  // Setup form initial state based on existing or new
  useEffect(() => {
    if (open) {
      if (existingPolicy && existingPolicy.levels && existingPolicy.levels.length > 0) {
        setLevels(existingPolicy.levels.map(l => ({
          levelNumber: l.levelNumber,
          delayMinutes: l.delayMinutes,
          userIds: Array.isArray(l.userIds) ? [...l.userIds] : []
        })));
      } else {
        setLevels([{ levelNumber: 1, delayMinutes: 0, userIds: [] }]);
      }
    }
  }, [open, existingPolicy]);

  const recomputeLevelNumbers = (newLevels) => {
    return newLevels.map((lvl, idx) => ({
      ...lvl,
      levelNumber: idx + 1,
    }));
  };

  const addLevel = () => {
    setLevels((prev) =>
      recomputeLevelNumbers([
        ...prev,
        { levelNumber: prev.length + 1, delayMinutes: 5, userIds: [] },
      ])
    );
  };

  const removeLevel = (index) => {
    setLevels((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return recomputeLevelNumbers(copy);
    });
  };

  const updateLevelProp = (index, prop, value) => {
    setLevels((prev) => {
      const copy = [...prev];
      copy[index][prop] = value;
      return copy;
    });
  };

  const addUserToLevel = (levelIndex, userId) => {
    setLevels((prev) => {
      const copy = [...prev];
      if (!copy[levelIndex].userIds.includes(userId)) {
        copy[levelIndex].userIds.push(userId);
      }
      return copy;
    });
  };

  const removeUserFromLevel = (levelIndex, userId) => {
    setLevels((prev) => {
      const copy = [...prev];
      copy[levelIndex].userIds = copy[levelIndex].userIds.filter(id => id !== userId);
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    for (const lvl of levels) {
      if (lvl.userIds.length === 0) {
        toast.error(`Level ${lvl.levelNumber} must have at least one assigned user.`);
        return;
      }
      if (lvl.delayMinutes < 0) {
        toast.error(`Level ${lvl.levelNumber} cannot have a negative delay.`);
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = existingPolicy ? { levels } : { teamId, levels };
      
      const url = existingPolicy 
        ? `http://localhost:7069/api/escalation-policies/${teamId}`
        : `http://localhost:7069/api/escalation-policies`;
      
      const method = existingPolicy ? 'put' : 'post';

      await axios({
        method,
        url,
        data: payload,
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Policy saved successfully");
      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to save policy.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper to resolve user ID to user Name
  const getUserName = (id) => {
    const user = users.find(u => u._id === id);
    return user ? user.name : "Unknown User";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-[600px] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{existingPolicy ? 'Update Escalation Policy' : 'Create Escalation Policy'}</DialogTitle>
          <DialogDescription>
            Configure the chain of escalation for this team.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-1 py-4">
          <form id="escalation-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {levels.map((lvl, index) => (
                <div key={index} className="relative rounded-lg border bg-card p-4 shadow-sm">
                  {/* Remove Button */}
                  {levels.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeLevel(index)}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  )}

                  <div className="mb-4 font-semibold flex items-center space-x-2">
                    <Badge variant="outline" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">
                      {lvl.levelNumber}
                    </Badge>
                    <span>Level {lvl.levelNumber}</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                    <div className="space-y-2">
                      <Label>Delay (minutes)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={lvl.delayMinutes}
                        onChange={(e) => updateLevelProp(index, "delayMinutes", Number(e.target.value))}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Assigned Users</Label>
                      {/* Fake multiselect UI */}
                      <div className="flex flex-wrap gap-2 mb-2 p-2 min-h-11 border rounded-md bg-background">
                        {lvl.userIds.map(userId => (
                          <Badge key={userId} variant="secondary" className="flex items-center gap-1 shrink-0">
                            {getUserName(userId)}
                            <button
                              type="button"
                              onClick={() => removeUserFromLevel(index, userId)}
                              className="text-muted-foreground hover:text-foreground outline-none"
                            >
                              <XIcon className="size-3" />
                            </button>
                          </Badge>
                        ))}
                        {lvl.userIds.length === 0 && (
                          <span className="text-sm text-muted-foreground/60 p-1">No users assigned</span>
                        )}
                      </div>

                      {/* Dropdown to add unassigned users */}
                      <Select
                        disabled={loading}
                        onValueChange={(val) => {
                          if (val) addUserToLevel(index, val);
                        }}
                        value="" // keep it reset
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add user to level..." />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter((u) => !lvl.userIds.includes(u._id))
                            .map((user) => (
                              <SelectItem key={user._id} value={user._id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          {users.filter((u) => !lvl.userIds.includes(u._id)).length === 0 && (
                            <SelectItem value="none" disabled>No more users available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={addLevel}
              disabled={loading}
            >
              <PlusIcon className="mr-2 size-4" />
              Add Escalation Level
            </Button>
          </form>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" form="escalation-form" disabled={loading}>
            {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Save Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
