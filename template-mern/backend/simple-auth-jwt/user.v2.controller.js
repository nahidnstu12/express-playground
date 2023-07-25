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

    await newUser?.save();
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

    const user = await UserModel.findOne({
      $or: [{ username }, { email: username }],
    });
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

export const profile = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(500).send({ msg: "Authorization header missing" });
  }
  try {
    const parsedToken = authorization.split(" ")[1];
    const tokenData = await jwt.verify(parsedToken, process.env.JWT_SECRET);

    const userData = await UserModel.findOne({
      $or: [
        { username: tokenData?.username },
        { email: tokenData?.email },
        { _id: tokenData?.id },
      ],
    });
    // const userData = await UserModel.findOne({
    //   username: tokenData?.username,
    //   email: tokenData?.email,
    // });
    if (!userData) {
      return res.status(500).send({ msg: "User not found" });
    }
    // we can send authenticated user data using this route
    const profile = {
      id: userData?._id,
      username: userData?.username,
      email: userData?.email,
      role: userData?.role,
      phone: userData?.phone,
      profile_pic: userData?.profile_pic,
    };

    return res.send({ data: profile });
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

export const updateSelfUser = async (req, res) => {
  const { userId } = req.user;
  const { phone, role, email } = req.body;

  if (!userId) {
    return res.status(500).send({ msg: "User Id is missing" });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { phone, role, email },
      { new: true }, // To return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send({ msg: "User Not Found" });
    }

    return res.status(201).send({ msg: "Record is updated." });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).send({ msg: "User Id is missing" });
  }
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({ msg: "User Not Found" });
    }

    return res.status(200).send({ msg: "Record is deleted." });
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

// Utitly Functions
/*
snippet
export const deleteUserById = async(req, res) => {
  try{

  }catch (err){
    return res.status(500).send({ msg: err });
  }
}

 return res.status(500).send({ msg: "User Not Found" });
*/

// const ExtractAutorization = (token) => {
//
// }
