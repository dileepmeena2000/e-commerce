import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category name is required"],
    },
    image: {
      type: Object, 
      default: {
        url: "", 
      },
    },
  },
  { timestamps: true }
);

export const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
