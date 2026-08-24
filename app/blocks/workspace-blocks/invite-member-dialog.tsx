"use client";

import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import toast from "react-hot-toast";

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

import { createInvitationApi } from "@/services/auth.services";

type InviteRole =
  | "ADMIN"
  | "EDITOR"
  | "VIEWER";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteMemberDialog({ open, onOpenChange, }: InviteMemberDialogProps) {

  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<InviteRole>("EDITOR");

  const [loading, setLoading] =
    useState(false);

  const handleInvite = async () => {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res =
        await createInvitationApi(
          normalizedEmail,
          role
        );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to create invitation"
        );
      }

      toast.success(
        "Invitation created successfully"
      );

      /*
       * TEMPORARY
       *
       * We don't have email sending yet,
       * so expose the token while testing.
       */
      console.log(
        "Invitation token:",
        data.invitationToken
      );

      console.log(
        "Invitation:",
        data.invitation
      );

      setEmail("");
      setRole("EDITOR");

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Invite member error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to invite member"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Invite Member
          </DialogTitle>

          <DialogDescription>
            Invite someone to join this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email
            </label>

            <Input
              type="email"
              placeholder="person@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Role
            </label>

            <Select
              value={role}
              onValueChange={(value) =>
                setRole(
                  value as InviteRole
                )
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="ADMIN">
                  Admin
                </SelectItem>

                <SelectItem value="EDITOR">
                  Editor
                </SelectItem>

                <SelectItem value="VIEWER">
                  Viewer
                </SelectItem>
                
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleInvite}
            disabled={
              loading ||
              !email.trim()
            }
          >
            <FiUserPlus className="mr-2" />

            {loading
              ? "Sending..."
              : "Send Invitation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}