import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {throw new Error("RESEND_API_KEY is not configured");}

const resend = new Resend(resendApiKey);

type SendInvitationEmailParams = {
  email: string;
  workspaceName: string;
  role: string;
  invitationUrl: string;
};

export const sendInvitationEmail = async ({
  email,
  workspaceName,
  role,
  invitationUrl,
}: SendInvitationEmailParams) => {
  
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

  const { data, error } = await resend.emails.send({
    from,
    to: [email],
    subject: `You've been invited to ${workspaceName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:40px 20px;background:#f5f5f5;font-family:Arial,sans-serif">
          <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e5e5">
            <h1 style="margin-top:0">You're invited!</h1>

            <p>
              You've been invited to join
              <strong>${workspaceName}</strong>
              as a <strong>${role}</strong>.
            </p>

            <p>
              Click below to accept the invitation.
            </p>

            <div style="margin:32px 0">
              <a
                href="${invitationUrl}"
                style="display:inline-block;padding:12px 20px;background:#000;color:#fff;text-decoration:none;border-radius:8px"
              >
                Accept Invitation
              </a>
            </div>

            <p style="color:#666;font-size:14px">
              This invitation expires in 7 days.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send invitation email");
  }

  return data;
};