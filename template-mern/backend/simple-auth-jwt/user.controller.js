import { ROLES } from "./constant.js";
import UserModel from "./user.model.js";
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
    const isAlreadyRegistered = await User.findOne({ email: email });

    // if already registered
    if (isAlreadyRegistered) {
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
        { email, role: req?.body?.role, username: req?.body?.username },
        process.env.JWT_SECRET,
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
    const userFound = await User.findOne({ email: email });

    // if already registered
    if (!userFound) {
      res.status(400).send({ msg: "User not found" });
    }

    //   user found, password compare
    const isMatch = await bcrypt.compare(password, userFound.password);
    console.log("userFound", userFound, isMatch);
    if (!isMatch) {
      res.status(400).send({ msg: "credentials do not match" });
    }
    const tokenGen = await jwt.sign(
      {
        email: userFound.email,
        role: userFound.role,
        username: userFound.username,
      },
      process.env.JWT_SECRET,
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
    const requestToken = req?.headers?.authorization || "";
    if (!requestToken) {
      res.status(401).send({ msg: "You have not permission." });
    }

    const decodedUser = await jwt.verify(requestToken, process.env.JWT_SECRET);

    const userFind = await User.findOne({
      email: decodedUser?.email,
      username: decodedUser?.username,
    });
    if (!userFind) {
      res.status(400).send({ msg: "malicious user" });
    }
    const profile = {
      username: decodedUser?.username,
      email: decodedUser?.email,
      role: decodedUser?.role,
    };

    res.status(200).send({ data: profile });
  } catch (err) {
    next(err);
  }
};

export const registerUserV1 = (req, res) => {
  try {
    const { username, email, password } = req.body;
    const usernameExist = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, (err, user) => {
        if (err) reject(new Error(err));
        if (user) reject({ msg: "Provide username should be unique." });
        resolve();
      });
    });
    const emailExist = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, (err, user) => {
        if (err) reject(new Error(err));
        if (user) reject({ msg: "Provide email should be unique." });
        resolve();
      });
    });

    Promise.all([usernameExist, emailExist])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                role: ROLES.Customer,
              });
              newUser
                .save()
                .then(() =>
                  res.status(201).send({ msg: "Successfully Registered" }),
                )
                .catch((err) => res.status(500).send({ err }));
            })
            .catch((err) => res.status(500).send({ err }));
        } else {
          res.status(400).send({ msg: "Password is missing!" });
        }
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
