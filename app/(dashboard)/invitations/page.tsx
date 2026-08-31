"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/User.context";

export default function InvitationsPage() {
  const router = useRouter();

  const {
    receivedInvitations,
    receivedInvitationsLoading,
    fetchReceivedInvitations,
  } = useUser();

  useEffect(() => {
    fetchReceivedInvitations();
  }, []);

  if (receivedInvitationsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading invitations...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          Workspace Invitations
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          View and manage invitations to join workspaces.
        </p>
      </div>

      {receivedInvitations.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border">
          <h2 className="text-lg font-medium">
            No pending invitations
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You don&apos;t have any workspace invitations right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {receivedInvitations.map((invitation) => (
            <div
              key={invitation._id}
              className="flex flex-col justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted text-lg font-semibold">
                  {invitation.workspace?.name
                    ?.charAt(0)
                    .toUpperCase() || "W"}
                </div>

                <div>
                  <h3 className="font-medium">
                    {invitation.workspace?.name ||
                      "Unknown Workspace"}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    You&apos;ve been invited to join as{" "}
                    <span className="font-medium text-foreground">
                      {invitation.role}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Expires{" "}
                    {new Date(
                      invitation.expiresAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  router.push(`/invitations/${invitation._id}`);
                }}
                className="rounded-lg bg-black px-4 py-2 text-sm text-white"
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