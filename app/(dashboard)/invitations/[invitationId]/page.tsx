"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  fetchReceivedInvitationApi,
  acceptInvitationByIdApi,
  declineInvitationByIdApi,
} from "@/services/auth.services";

import { useUser } from "@/context/User.context";


interface InvitationDetails {
  _id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;

  workspace: {
    _id: string;
    name: string;
    slug?: string;
    logo?: string;
  } | null;
}


export default function InvitationDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const invitationId = params.invitationId as string;


  const {
    fetchWorkspaces,
    fetchReceivedInvitations,
  } = useUser();

  const [invitation, setInvitation] =
    useState<InvitationDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [accepting, setAccepting] =
    useState(false);

  const [declining, setDeclining] =
    useState(false);


  // Fetch invitation details
  useEffect(() => {
    if (!invitationId) return;

    const fetchInvitation = async () => {
      try {
        setLoading(true);
        setError("");

        const res =
          await fetchReceivedInvitationApi(invitationId);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
            "Failed to fetch invitation"
          );
        }

        setInvitation(data.invitation);

      } catch (error) {
        console.error(
          "Fetch invitation error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch invitation"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [invitationId]);


  const handleAccept = async () => {
    if (!invitationId) return;

    try {
      setAccepting(true);

      const res =
        await acceptInvitationByIdApi(invitationId);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to accept invitation"
        );
      }

      toast.success(
        "Invitation accepted successfully"
      );

      // Refresh user's workspace list because
      // they now belong to a new workspace.
      await fetchWorkspaces();

      // Remove it from received invitations.
      await fetchReceivedInvitations();

      router.replace("/");

    } catch (error) {
      console.error(
        "Accept invitation error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to accept invitation"
      );
    } finally {
      setAccepting(false);
    }
  };


  const handleDecline = async () => {
    if (!invitationId) return;

    try {
      setDeclining(true);

      const res =
        await declineInvitationByIdApi(invitationId);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to decline invitation"
        );
      }

      toast.success(
        "Invitation declined"
      );

      // Remove declined invitation from
      // the received invitations list.
      await fetchReceivedInvitations();

      router.replace("/invitations");

    } catch (error) {
      console.error(
        "Decline invitation error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to decline invitation"
      );
    } finally {
      setDeclining(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading invitation...
        </p>
      </div>
    );
  }


  if (error || !invitation) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">
            Invitation unavailable
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error ||
              "This invitation could not be found."}
          </p>

          <button
            onClick={() => router.push("/invitations")}
            className="mt-6 rounded-lg border px-4 py-2 text-sm"
          >
            Back to invitations
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center p-6">
      <div className="w-full rounded-2xl border p-6 shadow-sm">

        {/* Workspace icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-muted text-xl font-semibold">
          {invitation.workspace?.name
            ?.charAt(0)
            .toUpperCase() || "W"}
        </div>


        <p className="mt-6 text-sm text-muted-foreground">
          You have been invited to join
        </p>

        <h1 className="mt-1 text-2xl font-semibold">
          {invitation.workspace?.name ||
            "Unknown Workspace"}
        </h1>

        <p className="mt-4 text-sm text-muted-foreground">
          You will join this workspace as:
        </p>

        <p className="mt-1 font-medium">
          {invitation.role}
        </p>

        <p className="mt-4 text-xs text-muted-foreground">
          This invitation expires on{" "}
          {new Date(
            invitation.expiresAt
          ).toLocaleDateString()}
        </p>


        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={handleAccept}
            disabled={accepting || declining}
            className="flex-1 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {accepting
              ? "Joining workspace..."
              : "Accept invitation"}
          </button>


          <button
            onClick={handleDecline}
            disabled={accepting || declining}
            className="flex-1 rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            {declining
              ? "Declining..."
              : "Decline"}
          </button>

        </div>

      </div>
    </div>
  );
}