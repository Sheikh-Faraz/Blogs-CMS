"use client";

import { useState, useEffect } from "react";
import { Mail, Clock, X, RefreshCw } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import toast from "react-hot-toast";

import { useUser } from "@/context/User.context";

import { 
  revokeInvitationApi,
  resendInvitationApi, 
} from "@/services/auth.services";


export default function PendingInvitationsCard() {

  // Context
  const {
    pendingInvitations,
    pendingInvitationsLoading,
    fetchPendingInvitations,
  } = useUser();

  useEffect(() => {
    fetchPendingInvitations();
  }, []);



  const [ revokeInvitationId, setRevokeInvitationId, ] = useState<string | null>(null);
  const [ revoking, setRevoking, ] = useState(false);



  const handleRevoke = async () => {
    if (!revokeInvitationId) {
      return;
    }

    try {
      setRevoking(true);

      const res =
        await revokeInvitationApi(
          revokeInvitationId
        );

      const data = await res.json();

      if (!res.ok) {
        throw new Error( data.message || "Failed to revoke invitation" );
      }

      toast.success( "Invitation revoked" );

      setRevokeInvitationId(null);

      await fetchPendingInvitations();
    } catch (error) {

      console.error( "Revoke invitation error:", error );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to revoke invitation"
      );
    } finally {
      setRevoking(false);
    }
  };



  // const handleRevoke = async (invitationId: string) => {
  //   try {

  //     const res = await revokeInvitationApi(invitationId);
  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.message || "Failed to revoke invitation")
  //     }

  //     toast.success("Invitation revoked");

  //     await fetchPendingInvitations();

  //   } catch (error) {

  //     console.error("Revoke invitation error:", error);

  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : "Failed to revoke invitation"
  //     );
  //   }
  // };


  const handleResend = async ( invitationId: string ) => {
    try {

      const res = await resendInvitationApi(invitationId);

      const data = await res.json();

      if (!res.ok) {
        throw new Error( data.message || "Failed to resend invitation" );
      };

      toast.success("Invitation resent successfully");

      await fetchPendingInvitations();

    } catch (error) {

      console.error("Resend invitation error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to resend invitation"
      );
    }
  };

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Pending Invitations
        </CardTitle>
      </CardHeader>

      <CardContent>
        {pendingInvitationsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : pendingInvitations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Mail className="h-8 w-8 text-muted-foreground/50" />

            <p className="mt-3 text-sm font-medium">
              No pending invitations
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Invitations waiting for acceptance will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingInvitations?.map((invitation) => {
              const expiresAt = new Date(
                invitation.expiresAt
              );

              return (
                <div
                  key={invitation._id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {invitation.email}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{invitation.role}</span>

                      <span>•</span>

                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />

                        Expires{" "}
                        {expiresAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Pending
                    </Badge>

                    <button
                      type="button"
                      onClick={() =>
                        handleResend(invitation._id)
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted"
                      title="Resend invitation"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      // onClick={() =>
                      //   handleRevoke(invitation._id)
                      // }
                      onClick={() =>
                        setRevokeInvitationId(invitation._id)
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                      title="Revoke invitation"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>


                </div>
              );
            })}
          </div>
        )}
      </CardContent>




        <AlertDialog
          open={!!revokeInvitationId}
          onOpenChange={(open) => {
            if (!open && !revoking) {
              setRevokeInvitationId(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Revoke invitation?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This invitation will immediately stop
                working. The recipient will no longer be
                able to use the current invitation link.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={revoking}
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleRevoke}
                disabled={revoking}
              >
                {revoking
                  ? "Revoking..."
                  : "Revoke Invitation"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>



    </Card>

  );
}