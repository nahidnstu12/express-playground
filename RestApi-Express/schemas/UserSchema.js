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
    role:{
      type: String,
      enum:["admin", "client"],
      default: "client"
    },
    todos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Todo",
      },
    ],
  },
  { timestamps: true }
);
/**
 * User is a Model
 */
const User = new mongoose.model("User", userSchema)
module.exports = User;