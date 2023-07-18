import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /\b[A-Za-z0-9.+_-]+@mail\.com\b/.test(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    min: 4,
    max: 8,
  },
  phone: {
    type: String,
    required: false,
  },
  role: {
    type: [String],
    default: "customer",
    enum: ["admin", "customer", "delivery"],
  },
});

const User = new mongoose.model("User", userSchema);
export default User;
