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

import { createInvitationApi, } from "@/services/auth.services";

import { useUser } from "@/context/User.context";

type InviteRole =
  | "ADMIN"
  | "EDITOR"
  | "VIEWER";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const rolesByMemberRole: Record<
  "OWNER" | "ADMIN" | "EDITOR" | "VIEWER",
  InviteRole[]
> = {
  OWNER: [
    "ADMIN",
    "EDITOR",
    "VIEWER",
  ],

  ADMIN: [
    "EDITOR",
    "VIEWER",
  ],

  EDITOR: [],

  VIEWER: [],
};

export default function InviteMemberDialog({
  open,
  onOpenChange,
}: InviteMemberDialogProps) {

  // Context
  const {
    authUser,
    members,
  } = useUser();

  const [email, setEmail] = useState("");

  const [role, setRole] = useState<InviteRole>("EDITOR");

  const [loading, setLoading] = useState(false);

  /*
   * Find the current user's membership
   * in the currently loaded workspace.
   */
  const currentMember = members.find(
    (member) => member.user._id === authUser?._id
  );

  const currentRole = currentMember?.role;

  const availableRoles =
    currentRole
      ? rolesByMemberRole[currentRole]
      : [];

  /*
   * If the current default role isn't
   * available, select the first valid role.
   */
  const selectedRole =
    availableRoles.includes(role)
      ? role
      : availableRoles[0];

  const handleInvite = async () => {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error( "Email is required" );
      return;
    }

    if (!selectedRole) {
      toast.error( "You do not have permission to invite members" );
      return;
    }

    try {
      setLoading(true);

      const res =
        await createInvitationApi(
          normalizedEmail,
          selectedRole
        );

      const data = await res.json();




    if (data.invitationUrl) {

      console.log( "INVITATION URL:", data.invitationUrl );
      await navigator.clipboard.writeText( data.invitationUrl );
      toast.success( "Invitation created and link copied!" );
      
    } else {
      toast.success( "Invitation sent successfully" );
    }





      if (!res.ok) {
        throw new Error( data.message || "Failed to create invitation" );
      }

      toast.success( "Invitation sent successfully" );

      setEmail("");

      setRole( availableRoles[0] || "EDITOR" );

      onOpenChange(false);

    } catch (error) {

      console.error( "Invite member error:", error );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to invite member"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * If member information isn't loaded
   * or this role can't invite, don't render
   * the dialog contents.
   */
  if (
    !currentRole ||
    availableRoles.length === 0
  ) {
    return null;
  }

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
              value={selectedRole}
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
                {availableRoles.includes(
                  "ADMIN"
                ) && (
                  <SelectItem value="ADMIN">
                    Admin
                  </SelectItem>
                )}

                {availableRoles.includes(
                  "EDITOR"
                ) && (
                  <SelectItem value="EDITOR">
                    Editor
                  </SelectItem>
                )}

                {availableRoles.includes(
                  "VIEWER"
                ) && (
                  <SelectItem value="VIEWER">
                    Viewer
                  </SelectItem>
                )}
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