"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Context
import { useUser } from "@/context/User.context";

import {
  validateInvitationApi,
  acceptInvitationApi,
} from "@/services/auth.services";


type InvitationData = {
  email: string;
  role: string;
  expiresAt: string;
};

type WorkspaceData = {
  name: string;
  slug: string;
};


// Frontend page the invited person actually sees.
export default function AcceptInvitationPage() {

  const router = useRouter();

  // Context
  const { authUser, selectWorkspace, fetchWorkspaces  } = useUser();

  const [accepting, setAccepting] = useState(false);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [invitation, setInvitation] = useState<InvitationData | null>(null);

  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link.");
      setLoading(false);
      return;
    }

    const validateInvitation = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await validateInvitationApi(token);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "Unable to validate invitation"
          );
        }

        setInvitation(data.invitation);
        setWorkspace(data.workspace);
      } catch (error) {

        console.error( "Invitation validation error:", error );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to validate invitation"
        );
      } finally {
        setLoading(false);
      }
    };

    validateInvitation();
  }, [token]);




  const handleAcceptInvitation = async () => {
  if (!token) {
    setError("Invalid invitation link.");
    return;
  }

  try {
    setAccepting(true);
    setError("");

    const res = await acceptInvitationApi(token);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Failed to accept invitation"
      );
    }

    const workspaceId =
      data.membership?.workspace;

    if (!workspaceId) {
      throw new Error(
        "Workspace information was not returned"
      );
    }

    // Refresh the user's workspace list because
    // the new Membership now exists.
    await fetchWorkspaces();

    // Use the existing workspace selection flow.
    await selectWorkspace(
      workspaceId.toString()
    );

  } catch (error) {
    console.error(
      "Accept invitation error:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "Failed to accept invitation"
    );
  } finally {
    setAccepting(false);
  }
};


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Checking invitation...</p>
      </main>
    );
  }

  if (error || !invitation || !workspace) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl border p-6">
          <h1 className="text-xl font-semibold">
            Invitation unavailable
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error ||
              "This invitation could not be loaded."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">
          You&apos;re invited!
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          You have been invited to join a workspace.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Workspace
            </p>

            <p className="font-medium">
              {workspace.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <p className="font-medium">
              {invitation.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Role
            </p>

            <p className="font-medium">
              {invitation.role}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            Invitation expires on{" "}
            {new Date(
              invitation.expiresAt
            ).toLocaleDateString()}
          </p>
        </div>


        {!authUser && (
        <div className="mt-6 space-y-3">
            <button
            className="w-full rounded-lg bg-black px-4 py-2 text-white"

            onClick={() => {
                if (!token) return;
                const redirectTo = `/invitation/accept?token=${encodeURIComponent(token)}`;
                router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
            }}>
                I already have an account
            </button>

            <button
            className="w-full rounded-lg border px-4 py-2"

            onClick={() => {
                if (!token) return;

                // const redirectTo = `/invitation/accept?token=${encodeURIComponent(token)}`;
                // router.push(`/signup?redirect=${encodeURIComponent(redirectTo)}`);

                const redirectTo = `/invitation/accept?token=${encodeURIComponent(token)}`;
                const signupUrl = `/signup?redirect=${encodeURIComponent(redirectTo)}&email=${encodeURIComponent(invitation.email)}`;

                router.push(signupUrl);
              }}
            >
                Create an account
            </button>
        </div>
        )}



        {authUser && (
        <button
            className="mt-6 w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            onClick={handleAcceptInvitation}
            disabled={
            accepting ||
            authUser.email.toLowerCase() !==
                invitation.email.toLowerCase()
            }
        >
            {accepting
            ? "Joining workspace..."
            : "Accept Invitation"}
        </button>
        )}


      </div>
    </main>
  );
}