"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/User.context";

function InvitationsSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading invitations">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex flex-col justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              <div className="h-3.5 w-56 max-w-[60vw] animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function InvitationsPage() {
  const router = useRouter();
  const { receivedInvitations, receivedInvitationsLoading, fetchReceivedInvitations } = useUser();

  useEffect(() => {
    fetchReceivedInvitations();
  }, []);

  if (receivedInvitationsLoading) {
    return (
      <div className="mx-4 h-full rounded-md p-6">
        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
        </div>
        <InvitationsSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-4 h-full rounded-md p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Workspace Invitations</h1>
        <p className="mt-2 text-sm text-muted-foreground">View and manage invitations to join workspaces.</p>
      </div>

      {receivedInvitations.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-md border bg-card"> 
          <h2 className="text-lg font-medium">No pending invitations</h2>
          <p className="mt-2 text-sm text-muted-foreground">You don&apos;t have any workspace invitations right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {receivedInvitations.map((invitation) => (
            <div key={invitation._id} className="flex flex-col bg-card justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted text-lg font-semibold">
                  {invitation.workspace?.name?.charAt(0).toUpperCase() || "W"}
                </div>
                <div>
                  <h3 className="font-medium">{invitation.workspace?.name || "Unknown Workspace"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You&apos;ve been invited to join as <span className="font-medium text-foreground">{invitation.role}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => router.push(`/invitations/${invitation._id}`)} 
                className="bg-card text-card-foreground rounded-md px-4 py-2 text-sm hover:bg-muted border"
              >
                View invitation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
