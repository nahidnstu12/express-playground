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
      res.status(400).send({ msg: "Already Registered" });
    }
    if (!password) {
      res.status(400).send({ msg: "Passsword is missing" });
    }
    // password hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      ...req.body,
      password: passwordHash,
    });

    // token generation
    try {
      const tokenGenerate = jwt.sign(
        { email, role: req?.body?.role },
        "section-token-generate",
        {
          expiresIn: "1h",
        },
      );
      // save user
      // await User.create({ ...user, password: passwordHash });
      await newUser.save();
      res
        .status(201)
        .send({ msg: "Successfully registered user", token: tokenGenerate });
    } catch (err) {
      console.log("token err", err);
      res.status(500).send({ message: err });
    }
    //
  } catch (err) {
    console.log("password err", err);
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userFound = await User.find({ email: email });

    // if already registered
    if (userFound?.length === 0) {
      res.status(400).send({ msg: "User not found" });
    }

    //   user found, password compare
    const isMatch = await bcrypt.compare(password, userFound[0].password);
    console.log("userFound", userFound, isMatch);
    if (!isMatch) {
      res.status(400).send({ msg: "credentials do not match" });
    }
    const tokenGen = await jwt.sign(
      { email: userFound[0].email, role: userFound[0].role },
      "section-token-generate",
      { expiresIn: "1h" },
    );
    res.status(200).send({ msg: "login successful", token: tokenGen });
  } catch (err) {
    console.log("login user err", err);
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
