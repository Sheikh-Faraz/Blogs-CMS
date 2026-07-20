// import mongoose from "mongoose";

// const TagSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     unique: true 
//   },
// });

// export default mongoose.models.Tag || mongoose.model("Tag", TagSchema);


import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
  },
  { timestamps: true }
);

TagSchema.index(
  {
    workspace: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.Tag ||
  mongoose.model("Tag", TagSchema);