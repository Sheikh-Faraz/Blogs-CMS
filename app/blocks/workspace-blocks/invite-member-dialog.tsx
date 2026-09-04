"use client";

import { useState } from "react";

// Context
import { useUser } from "@/context/User.context";

// Services
import { createInvitationApi } from "@/services/auth.services";

import LoaderIcon from "@/app/blocks/loading/Loader";

import toast from "react-hot-toast";

import { FiUserPlus } from "react-icons/fi";
import { Check, Loader2, X } from "lucide-react";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



type InviteRole = "ADMIN" | "EDITOR" | "VIEWER";
type MemberRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const rolesByMemberRole: Record<MemberRole, InviteRole[]> = {
  OWNER: ["ADMIN", "EDITOR", "VIEWER"],
  ADMIN: ["EDITOR", "VIEWER"],
  EDITOR: [],
  VIEWER: [],
};

const rolePermissions: Record<InviteRole, { description: string; can: string[]; cannot: string[] }> = {
  ADMIN: {
    description: "Manage the workspace and its members without ownership control.",
    can: [
      "Manage workspace content",
      "Invite members",
      "Manage Editors and Viewers",
      "Manage day-to-day workspace settings",
    ],
    cannot: [
      "Change or remove the Owner",
      "Manage another Admin's role",
      "Transfer workspace ownership",
    ],
  },
  EDITOR: {
    description: "Create and manage workspace content without member administration.",
    can: [
      "Create and edit blog content",
      "Manage assigned content",
      "View workspace members",
    ],
    cannot: [
      "Invite or manage members",
      "Change member roles",
      "Manage workspace settings",
    ],
  },
  VIEWER: {
    description: "Read-only access to the workspace.",
    can: [
      "View workspace content",
      "View workspace members",
    ],
    cannot: [
      "Create or edit content",
      "Invite or manage members",
      "Change member roles",
      "Manage workspace settings",
    ],
  },
};

export default function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const { authUser, members } = useUser();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("EDITOR");
  const [loading, setLoading] = useState(false);

  const currentMember = members.find((member) => member.user._id === authUser?._id);
  const currentRole = currentMember?.role;
  const availableRoles = currentRole ? rolesByMemberRole[currentRole] : [];
  const selectedRole = availableRoles.includes(role) ? role : availableRoles[0];

  const handleInvite = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Email is required");
      return;
    }

    if (!selectedRole) {
      toast.error("You do not have permission to invite members");
      return;
    }

    try {
      setLoading(true);

      const res = await createInvitationApi(normalizedEmail, selectedRole);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create invitation");
      }

      if (data.invitationUrl) {
        console.log("INVITATION URL:", data.invitationUrl);
        await navigator.clipboard.writeText(data.invitationUrl);
        toast.success("Invitation created and link copied!");
      } else {
        toast.success("Invitation sent successfully");
      }

      setEmail("");
      setRole(availableRoles[0] || "EDITOR");
      onOpenChange(false);
    } catch (error) {
      console.error("Invite member error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to invite member");
    } finally {
      setLoading(false);
    }
  };

  if (!currentRole || availableRoles.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Invite someone to join this workspace.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="person@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setRole(value as InviteRole)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.includes("ADMIN") && <SelectItem value="ADMIN">Admin</SelectItem>}
                {availableRoles.includes("EDITOR") && <SelectItem value="EDITOR">Editor</SelectItem>}
                {availableRoles.includes("VIEWER") && <SelectItem value="VIEWER">Viewer</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          {selectedRole && (
            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="mb-4">
                <p className="text-sm font-semibold">{selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {rolePermissions[selectedRole].description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    They can
                  </p>
                  <div className="space-y-2">
                    {rolePermissions[selectedRole].can.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    They can&apos;t
                  </p>
                  <div className="space-y-2">
                    {rolePermissions[selectedRole].cannot.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button className="w-full" onClick={handleInvite} disabled={loading || !email.trim()}>
            {loading ? (
              <>
                <LoaderIcon 
                  size="lg"
                />
              </>
            ) : (
              <>
                <FiUserPlus className="mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
