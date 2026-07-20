import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    slug: { type: String, unique: true },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    heroImage: String,
    
    heroImagePublicId: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    // ✅ NEW (CRITICAL)
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);