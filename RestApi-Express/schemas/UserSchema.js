const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
/**
 * User is a Model
 */
const User = new mongoose.model("User", userSchema)
module.exports = User;