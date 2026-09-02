"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Search, MapPin, Mail, CalendarDays, ShieldCheck } from "lucide-react";
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

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function TeamCard() {
  const { members, authUser, workspace, CurrentActiveWorkspace, membersLoading } = useUser();
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [updatingMembershipId, setUpdatingMembershipId] = useState<string | null>(null);

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

  const handleRoleChange = async (member: WorkspaceMember, role: EditableRole) => {
    if (!workspace?._id || !canEditMember(member) || role === member.role) return;

    try {
      setUpdatingMembershipId(member._id);
      await updateWorkspaceMemberRoleApi(workspace._id, member._id, role);
      await CurrentActiveWorkspace();
      toast.success(`${member.user.fullName}'s role updated`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update member role");
    } finally {
      setUpdatingMembershipId(null);
    }
  };

  return (
    <div className="w-full px-4 md:px-6 py-4 md:py-6">
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

        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className="pl-9" />
          </div>
          <div className="text-sm text-muted-foreground sm:hidden">
            {members.length} {members.length === 1 ? "member" : "members"}
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

                  <div className="hidden sm:block">
                    <Select value={member.role} disabled={!editable || isUpdating} onValueChange={(value) => handleRoleChange(member, value as EditableRole)}>
                      <SelectTrigger className="h-9 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {currentMember?.role === "OWNER" && <SelectItem value="ADMIN">Admin</SelectItem>}
                        <SelectItem value="EDITOR">Editor</SelectItem>
                        <SelectItem value="VIEWER">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })
          )}
        </div>
      </div>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />

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
