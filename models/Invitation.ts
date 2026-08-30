import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    // Workspace the person is being invited to
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    // Email address the invitation was sent to
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Role the user will receive after accepting
    role: {
      type: String,
      enum: ["ADMIN", "EDITOR", "VIEWER"],
      default: "VIEWER",
      required: true,
    },

    // User who sent the invitation
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Hashed invitation token
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    // Invitation lifecycle
    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "DECLINED",
        "REVOKED",
        "EXPIRED",
      ],
      default: "PENDING",
    },

    // Invitation becomes invalid after this time
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful for finding pending invitations for a workspace/email
invitationSchema.index({
  workspace: 1,
  email: 1,
  status: 1,
});

const Invitation =
  mongoose.models.Invitation ||
  mongoose.model("Invitation", invitationSchema);

export default Invitation;