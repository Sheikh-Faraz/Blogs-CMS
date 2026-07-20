import mongoose from "mongoose";


const socialSchema = new mongoose.Schema(
  {
    linkedin: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: true },
    },

    github: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: true },
    },

    x: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: true },
    },

    facebook: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: true },
    },

    instagram: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: true },
    },

    youtube: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: true },
    },

    discord: {
      url: { type: String, default: "" },
      visible: { type: Boolean, default: true },
    },
  },
  { _id: false }
);


const userSchema = new mongoose.Schema(
  {
    defaultWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      default: "",
    },

    profilePic: {
      type: String,
      default: "",
    },
    
    banner: {
      type: String,
      default: "",
    },
    
    location: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    socials: {
      type: socialSchema,
      default: () => ({}),
    },

    passwordHash: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },


    bannerPublicId: {
      type: String,
      default: "",
    },

    profilePicPublicId: {
      type: String,
      default: "",
    },

  },
  { timestamps: true } // ✅ Adds createdAt and updatedAt
);

// ✅ Prevent model overwrite in dev mode
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
