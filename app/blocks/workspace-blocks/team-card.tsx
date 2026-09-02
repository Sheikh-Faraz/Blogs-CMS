"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Search, MapPin, Mail, CalendarDays, ShieldCheck, CircleHelp, Check, X } from "lucide-react";
import toast from "react-hot-toast";

import { useUser } from "@/context/User.context";
import { updateWorkspaceMemberRoleApi } from "@/services/team.services";
import InviteMemberDialog from "@/app/blocks/workspace-blocks/invite-member-dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import type { WorkspaceMember } from "@/context/User.context";

type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
type EditableRole = "ADMIN" | "EDITOR" | "VIEWER";

const roleLabel: Record<Role, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

const rolePermissions: Record<Role, { description: string; can: string[]; cannot: string[] }> = {
  OWNER: {
    description: "Full control over the workspace and its members.",
    can: [
      "Manage all workspace content",
      "Invite and manage workspace members",
      "Change member roles",
      "Manage workspace settings",
    ],
    cannot: [],
  },
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

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function TeamCard() {

  // Context
  const { 
    members, 
    authUser, 
    workspace, 
    CurrentActiveWorkspace, 
    membersLoading,
   } = useUser();


  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [updatingMembershipId, setUpdatingMembershipId] = useState<string | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    member: WorkspaceMember;
    role: EditableRole;
  } | null>(null);
  const [roleInfoOpen, setRoleInfoOpen] = useState(false);

  const currentMember = members.find((member) => member.user._id === authUser?._id);
  const canManageRoles = currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      [member.user.fullName, member.user.email, member.role].some((value) => value.toLowerCase().includes(query))
    );
  }, [members, search]);

  const openProfile = (member: WorkspaceMember) => {
    setSelectedMember(member);
    setProfileOpen(true);
  };

  const canEditMember = (member: WorkspaceMember) => {
    if (!canManageRoles) return false;
    if (member.role === "OWNER") return false;
    if (member.user._id === authUser?._id) return false;
    if (currentMember?.role === "ADMIN" && member.role === "ADMIN") return false;
    return true;
  };

  const requestRoleChange = (member: WorkspaceMember, role: EditableRole) => {
    if (!workspace?._id || !canEditMember(member) || role === member.role) return;
    setPendingRoleChange({ member, role });
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange || !workspace?._id) return;

    const { member, role } = pendingRoleChange;

    try {
      setUpdatingMembershipId(member._id);
      await updateWorkspaceMemberRoleApi(workspace._id, member._id, role);
      await CurrentActiveWorkspace();
      setPendingRoleChange(null);
      toast.success(`${member.user.fullName}'s role updated to ${roleLabel[role]}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update member role");
    } finally {
      setUpdatingMembershipId(null);
    }
  };

  const renderPermissionList = (items: string[], type: "can" | "cannot") => (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2 text-sm">
          {type === "can" ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          ) : (
            <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full px-4 md:px-6 py-4 md:py-6 bg-card rounded-md">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Workspace Members</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Add teammates to collaborate on projects together. Control permissions and manage access levels for each member.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-sm text-muted-foreground whitespace-nowrap sm:block">
              {members.length} {members.length === 1 ? "member" : "members"}
            </div>
            {canManageRoles && (
              <Button onClick={() => setInviteOpen(true)}>Invite Member</Button>
            )}
          </div>
        </div>

        {/* <div className="mb-5 flex items-center justify-between gap-3"> */}
        <div className="mb-5 flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className="pl-9" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setRoleInfoOpen(true)}
              aria-label="View role permissions"
            >
              <CircleHelp className="h-4 w-4" />
            </Button>
            <span className="sm:hidden">
              {members.length} {members.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        <div className="border-t">
          {membersLoading ? (
            <div className="space-y-3 py-5">
              {[1, 2, 3, 4].map((item) => <div key={item} className="h-16 animate-pulse rounded-md bg-muted/40" />)}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-14 text-center text-sm text-muted-foreground">
              {search ? "No members match your search." : "No workspace members found."}
            </div>
          ) : (
            filteredMembers.map((member) => {
              const editable = canEditMember(member);
              const isUpdating = updatingMembershipId === member._id;

              return (
                <div key={member._id} className="group flex min-h-20 items-center gap-3 border-b py-3">
                  <button type="button" onClick={() => openProfile(member)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={member.user.profilePic || undefined} />
                      <AvatarFallback>{initials(member.user.fullName)}</AvatarFallback>
                    </Avatar>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{member.user.fullName}</span>
                      <span className="block truncate text-xs text-muted-foreground">{member.user.email}</span>
                    </span>
                  </button>

                  <div className="hidden items-center gap-2 sm:flex">
                    {member.role === "OWNER" ? (
                      <span className="text-sm font-medium mr-10">
                        Owner
                      </span>
                    ) : (
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleRoleChange(member._id, value as "ADMIN" | "EDITOR" | "VIEWER")}
                        disabled={!canEditMember(member)}
                      >
                        <SelectTrigger className="w-32.5">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="EDITOR">Editor</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="sm:hidden"><Badge variant="outline">{roleLabel[member.role]}</Badge></div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label={`Actions for ${member.user.fullName}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openProfile(member)}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleInfoOpen(true)}>View Role Permissions</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })
          )}
        </div>
      </div>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <Dialog open={pendingRoleChange !== null} onOpenChange={(open) => !open && !updatingMembershipId && setPendingRoleChange(null)}>
        
        {/* <DialogContent className="max-w-lg"> */}
        <DialogContent className="w-[calc(50%)]  max-w-none!">
          {pendingRoleChange && (
            <>
              <DialogHeader>
                <DialogTitle>Change member role?</DialogTitle>
                <DialogDescription>
                  You are changing <span className="font-medium text-foreground">{pendingRoleChange.member.user.fullName}</span> from {roleLabel[pendingRoleChange.member.role]} to {roleLabel[pendingRoleChange.role]}.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-lg border bg-muted/20 p-4 my-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{roleLabel[pendingRoleChange.role]}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{rolePermissions[pendingRoleChange.role].description}</p>
                    </div>
                    <Badge variant="secondary">New role</Badge>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">They can</p>
                    {renderPermissionList(rolePermissions[pendingRoleChange.role].can, "can")}
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">They can&apos;t</p>
                    {rolePermissions[pendingRoleChange.role].cannot.length > 0 ? (
                      renderPermissionList(rolePermissions[pendingRoleChange.role].cannot, "cannot")
                    ) : (
                      <p className="text-sm text-muted-foreground">No restrictions at this level.</p>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" disabled={!!updatingMembershipId} onClick={() => setPendingRoleChange(null)}>
                  Cancel
                </Button>
                <Button disabled={!!updatingMembershipId} onClick={confirmRoleChange}>
                  {updatingMembershipId ? "Updating..." : `Change to ${roleLabel[pendingRoleChange.role]}`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={roleInfoOpen} onOpenChange={setRoleInfoOpen}>
        {/* <DialogContent className="max-w-2xl"> */}
        {/* <DialogContent className="w-[calc(100%-20rem)]! border border-red-600"> */}
        <DialogContent className="w-[calc(100%-20rem)]! max-w-none! ">

          <DialogHeader>
            <DialogTitle>Workspace role permissions</DialogTitle>
            <DialogDescription>
              Each role controls what a member can access and manage in the workspace.
            </DialogDescription>
          </DialogHeader>

          {/* <div className="flex border border-blue-600"> */}
          {/* <div className=""> */}
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(rolePermissions) as Role[]).map((role) => (
              <div key={role} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{roleLabel[role]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{rolePermissions[role].description}</p>
                  </div>
                  <Badge variant="outline">{roleLabel[role]}</Badge>
                </div>

                <div className="space-y-2">
                  {rolePermissions[role].can.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                  {rolePermissions[role].cannot.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>

      </Dialog>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-lg">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedMember.user.profilePic || undefined} />
                    <AvatarFallback>{initials(selectedMember.user.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-xl">{selectedMember.user.fullName}</DialogTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary">{roleLabel[selectedMember.role]}</Badge>
                      <span className="text-xs text-muted-foreground">Workspace member</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-3 pt-2">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5" /> Email</div>
                  <p className="mt-1 break-all text-sm">{selectedMember.user.email}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Location</div>
                  <p className="mt-1 text-sm">{selectedMember.user.location || "Location not specified"}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" /> Joined</div>
                  <p className="mt-1 text-sm">
                    {(() => {
                      const joinedAt = (selectedMember as WorkspaceMember & { createdAt?: string }).createdAt;
                      return joinedAt ? new Date(joinedAt).toLocaleDateString() : "Not available";
                    })()}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> About</div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{selectedMember.user.about || "No information provided."}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
