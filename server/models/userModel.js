import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should be at least 6 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: false, 
    },
    country: {
      type: String,
      required: false, 
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


const userModel = mongoose.model("User", userSchema);
export default userModel;



