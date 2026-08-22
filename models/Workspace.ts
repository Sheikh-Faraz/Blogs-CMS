import mongoose from "mongoose";


const socialSchema = new mongoose.Schema(
  {
    linkedin: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },

    github: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },

    x: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },

    facebook: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },

    instagram: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },

    youtube: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },

    discord: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },
  },
  { _id: false }
);

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
      default: "",
    },

    logoPublicId: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    bannerPublicId: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    founded: {
      type: Date,
      default: null,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },

    socials: {
      type: socialSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

const Workspace =
  mongoose.models.Workspace ||
  mongoose.model("Workspace", workspaceSchema);

export default Workspace;