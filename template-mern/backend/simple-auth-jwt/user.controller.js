import User from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({ data: users, total: users?.length });
  } catch (err) {
    next(err);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const isAlreadyRegistered = await User.find({ email: email });

    // if already registered
    if (isAlreadyRegistered?.length > 0) {
      res
        .status(400)
        .send({ msg: "Already Registered", data: isAlreadyRegistered });
    }
    // password hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = {
      ...req.body,
    };
    delete user.password;

    // token generation
    try {
      const tokenGenerate = jwt.sign(user, "section-token-generate", {
        expiresIn: "1h",
      });
      // save user
      await User.create({ ...user, password: passwordHash });
      res
        .status(201)
        .send({ msg: "Successfully registered user", token: tokenGenerate });
      // await User.save();
    } catch (err) {
      res.status(500).send({ message: err });
    }
    //
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({ data: users, total: users?.length });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({ data: users, total: users?.length });
  } catch (err) {
    next(err);
  }
};

export const profile = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({ data: users, total: users?.length });
  } catch (err) {
    next(err);
  }
};
