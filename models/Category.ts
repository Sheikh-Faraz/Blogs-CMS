// import mongoose from "mongoose";

// const CategorySchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     unique: true 
//   },
// });

// export default mongoose.models.Category || mongoose.model("Category", CategorySchema);


import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
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

CategorySchema.index(
  {
    workspace: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);