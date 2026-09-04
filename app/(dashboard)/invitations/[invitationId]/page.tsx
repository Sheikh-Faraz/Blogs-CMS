"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { useUser } from "@/context/User.context";

import {
  fetchReceivedInvitationApi,
  acceptInvitationByIdApi,
  declineInvitationByIdApi,
} from "@/services/auth.services";


import { toast } from "sonner";

import { CircleArrowLeft } from 'lucide-react';

import LoaderIcon from "@/app/blocks/loading/Loader";


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


function InvitationSkeleton() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-xl items-center p-6">
      <div className="w-full rounded-2xl border bg-card p-6 text-card-foreground shadow-sm">
        
        {/* Back to invitations */}
        <div className="mb-8 flex w-fit items-center gap-2 py-2">
          <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>

        {/* Workspace */}
        <div className="flex gap-5">
          
          {/* Workspace icon */}
          <div className="flex h-14 w-14 shrink-0 animate-pulse items-center justify-center rounded-xl bg-muted" />

          <div className="space-y-2">
            {/* "You have been invited..." */}
            <div className="h-4 w-44 animate-pulse rounded bg-muted" />

            {/* Workspace name */}
            <div className="mt-1 h-7 w-52 animate-pulse rounded bg-muted" />
          </div>

        </div>

        {/* Role */}
        <div className="mt-8 space-y-2">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>

        {/* Expiration */}
        <div className="mt-8 h-3 w-52 animate-pulse rounded bg-muted" />

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
        </div>

      </div>
    </div>
  );
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
      <>
        <InvitationSkeleton />
      </>
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
            {error || "This invitation could not be found."}
          </p>

          <button
            onClick={() => router.push("/invitations")}
            className="mt-6 rounded-lg border-2 px-4 py-2 text-sm hover:bg-muted"
          >
            Back to invitations
          </button>
        </div>
      </div>
    );
  }


  return (
    // <div className="mx-auto flex min-h-[70vh] max-w-xl items-center p-6 border border-red-500">
    <div className="mx-auto flex min-h-[70vh] w-xl items-center p-6 ">

      <div className="w-full rounded-2xl border p-6 shadow-sm bg-card text-card-foreground">

        <Link 
          href="/invitations" 
          className="py-2 mb-8 flex gap-2 items-center hover:text-gray-300 w-fit"
        >
          <CircleArrowLeft className="text-[#E85129]" />
            Back to invitations
        </Link>

        <div className="flex gap-5">
          {/* Workspace icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-muted text-xl font-semibold">
            {invitation.workspace?.name
              ?.charAt(0)
              .toUpperCase() || "W"}
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">
              You have been invited to join
            </p>

            <h1 className="mt-1 text-2xl font-semibold">
              {invitation.workspace?.name ||
                "Unknown Workspace"}
            </h1>
          </div>

        </div>


        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            You will join this workspace as:
          </p>

          <p className="mt-1 font-medium">
            {invitation.role}
          </p>
        </div>


        <p className="mt-8 text-xs text-muted-foreground">
          This invitation expires on{" "}
          {new Date(
            invitation.expiresAt
          ).toLocaleDateString()}
        </p>


        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={handleAccept}
            disabled={accepting || declining}
            className="flex-1 bg-card  rounded-lg px-4 py-2 text-sm disabled:opacity-50 hover:bg-muted border"
          >
            {accepting
              ? <LoaderIcon />
              : "Accept invitation"}
          </button>

          <button
            onClick={handleDecline}
            disabled={accepting || declining}
            className="flex-1 rounded-lg border px-4 py-2 text-sm disabled:opacity-50 hover:bg-muted"
          >
            {declining
              ? <LoaderIcon />
              : "Decline"}
          </button>

        </div>

      </div>
    </div>
  );
}