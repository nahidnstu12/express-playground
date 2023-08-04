import mongoose from "mongoose";
import { ROLES } from "./constant.js";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide unique username"],
      unique: [true, "Username already exists"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "email already exists"],
      validate: {
        validator: function (value) {
          return /\b[A-Za-z0-9.+_-]+@gmail\.com\b/.test(value);
        },
        message: "Invalid email format. Expected format test@mail.com",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [4, "Password will between 4 and 50 characters."],
      maxlength: [200, "Password will between 4 and 50 characters."],
    },
    phone: {
      type: String,
    },
    is_verified: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    otp: {
      type: String,
      minLength: [6, "OTP length should be 6 digit"],
    },
    is_mobile_verified: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    role: {
      type: [Number],
      default: 1,
      enum: Object.values(ROLES),
    },
  },
  { timestamps: true },
);

const User = new mongoose.model("User", userSchema);
export default User;
