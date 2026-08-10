// import mongoose from "mongoose";

// const workspaceSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     logo: {
//       type: String,
//       default: "",
//     },

//     banner: {
//       type: String,
//       default: "",
//     },

//     about: {
//       type: String,
//       default: "",
//     },

//     location: {
//       type: String,
//       default: "",
//     },


//     slug: {
//       type: String,
//       unique: true,
//       required: true,
//     },


//     socials: {
//       website: {
//         type: String,
//         default: "",
//       },

//       linkedin: {
//         type: String,
//         default: "",
//       },
      
//       github: {
//         type: String,
//         default: "",
//       },

//       x: {
//         type: String,
//         default: "",
//       },

//       instagram: {
//         type: String,
//         default: "",
//       },

//       facebook: {
//         type: String,
//         default: "",
//       },

//       youtube: {
//         type: String,
//         default: "",
//       },

//       discord: {
//         type: String,
//         default: "",
//       },

//     },

//   },
//   { timestamps: true }
// );

// const Workspace =
//   mongoose.models.Workspace ||
//   mongoose.model("Workspace", workspaceSchema);

// export default Workspace;







import mongoose from "mongoose";

// If everything works as intended then change the visible for socials in user model to false 

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