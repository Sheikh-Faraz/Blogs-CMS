import mongoose from "mongoose";

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

    banner: {
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


    slug: {
      type: String,
      unique: true,
      required: true,
    },


    socials: {
      website: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },
      
      github: {
        type: String,
        default: "",
      },

      x: {
        type: String,
        default: "",
      },

      instagram: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },

      discord: {
        type: String,
        default: "",
      },

    },

  },
  { timestamps: true }
);

const Workspace =
  mongoose.models.Workspace ||
  mongoose.model("Workspace", workspaceSchema);

export default Workspace;