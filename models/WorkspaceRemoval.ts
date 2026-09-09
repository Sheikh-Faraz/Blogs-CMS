import mongoose from "mongoose";

const workspaceRemovalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ["KICKED"],
      required: true,
    },
  },
  { timestamps: true }
);

workspaceRemovalSchema.index({ user: 1, workspace: 1, createdAt: -1 });

const WorkspaceRemoval =
  mongoose.models.WorkspaceRemoval ||
  mongoose.model("WorkspaceRemoval", workspaceRemovalSchema);

export default WorkspaceRemoval;
