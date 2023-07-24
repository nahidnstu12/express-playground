import UserModel from "./user.model.js";
import bcrypt from "bcryptjs";
import { ROLES } from "./constant.js";
import jwt from "jsonwebtoken";

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

    // Promise.all([usernameExist, emailExist])
    //   .then(async () => {
    //     if (password) {
    //       const hashedPassword = await bcrypt.hash(password, 10);
    //       const newUser = new UserModel({
    //         username,
    //         email,
    //         password: hashedPassword,
    //         role: ROLES.Customer,
    //       });
    //       await newuser?.save();
    //       res.status(201).send({ msg: "Successfully Registered" });
    //     }
    //   })
    //   .catch((err) => {
    //     res.status(500).send({ error: err });
    //   });

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

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const usernameExist = await UserModel.findOne({ username });
    if (usernameExist) {
      return res.status(400).send({ msg: "Username should be unique." });
    }

    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      return res.status(400).send({ msg: "Email should be unique." });
    }

    if (!password) {
      return res.status(400).send({ msg: "Password is missing!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role: ROLES.Customer,
    });

    await newuser?.save();
    res.status(201).send({ msg: "Successfully Registered" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .send({ msg: "Username or password cannot be empty." });
    }

    const user = await UserModel.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user?.password))) {
      return res.status(404).send({ msg: "User not found" });
    }

    // Create token
    const token = await jwt.sign(
      {
        userId: user?._id,
        username: user?.username,
        email: user?.email,
        role: user?.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).send({ msg: "Login Successful.", token });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ error: err.message });
  }
};
