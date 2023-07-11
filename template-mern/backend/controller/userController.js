// external imports
import bcrypt from "bcryptjs";
import { unlink } from "fs";
import path from "path";

// internal imports
import User from "../models/userSchemas.js";

// get all users
export const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ data: users, total: users.length });
  } catch (err) {
    next(err);
  }
};

export const getSingleUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.find({ _id: id });
    if (user.length === 0) {
      res.status(404).json("user not found!!");
    }
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

// add user
export const addUser = async (req, res) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  // save user or send error
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    let user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json("user not found");
    }

    let userEmail = await User.findOne({ email: req.body.email || "" });

    if (userEmail?.email == undefined) {
      user.email = req.body.email || user.email;
    } else if (userEmail && userEmail?.email !== user.email) {
      return res.status(400).json("You can't use this email");
    }
    if (req.body.role && req.user.role !== "admin") {
      return res.status(400).json("You can't use this action");
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword || user.password;
    }

    user.role = req.body.role || user.role;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: user,
      },
      { new: true }
    );
    res.status(200).json({ user, updatedUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

// remove user
export const removeUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    // remove user avatar if any
    if (user.avatar) {
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({
      message: "User was removed successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
};
