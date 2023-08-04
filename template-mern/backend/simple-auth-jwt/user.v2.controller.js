import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import appConfig from "../@core/config.js";
import { ROLES } from "./constant.js";
import {
  generateOTPService,
  generateRandomSixDigitNumber,
  registerMailService,
} from "./service.js";
import UserModel from "./user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExist = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (userExist) {
      return res.status(400).send({ msg: "User already exists." });
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

    await newUser.save();

    const token = await jwt.sign({ username }, appConfig.JWT_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
    });

    console.log("verification token=>", token);

    res.status(201).send({
      msg: "Successfully Registered. Please Confirm your registration from your Email.",
      // ref: token,
    });
    // sending mail
    const link = `http://localhost:6050/api/v2/email-verify?ref=${token}`;
    await registerMailService({ username, userEmail: email, link, type: 1 });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// email verification
export const emailVerification = async (req, res) => {
  const { ref } = req.query;
  if (!ref) {
    return res.status(400).send({ msg: "Invalid Verification Request" });
  }

  try {
    const parsedToken = await jwt.verify(ref, appConfig.JWT_SECRET);
    if (!parsedToken) {
      return res.status(400).send({ msg: "Invalid Verification Request" });
    }

    // user is valid, so update user to be verified
    const user = await UserModel.findOneAndUpdate(
      { username: parsedToken?.username, is_verified: 0 },
      { is_verified: 1 },
      { new: true },
    );
    if (!user) {
      return res.status(400).send({ msg: "User already email verified." });
    }

    // res.status(200).send({ msg: "verification successful" });
    res.redirect(200, "https://platform.futurenation.gov.bd/");
  } catch (err) {
    return res.status(500).send({ msg: err });
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
      $or: [
        { username, is_verified: 1 },
        { email: username, is_verified: 1 },
      ],
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
      appConfig.JWT_SECRET,
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
    const tokenData = await jwt.verify(parsedToken, appConfig.JWT_SECRET);

    const userData = await UserModel.findOne({
      $or: [
        { username: tokenData?.username },
        { email: tokenData?.email },
        { _id: tokenData?.id },
      ],
    });
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

export const phoneVerification = async (req, res) => {
  const { phone } = req.query;
  const { userId } = req.user;
  if (!phone || !userId) {
    return res.status(500).send({ msg: "Requested body is missing" });
  }
  try {
    const { msg, code } = await generateOTPService({ userId });
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, is_mobile_verified: 0 },
      { phone, otp: code },
      { new: true }, // To return the updated document
    );

    if (!updatedUser) {
      // return res.status(400).send({ msg: "User not found." });
      return res.status(400).send({ msg: "User already mobile verified." });
    }
    res.status(200).send({ msg });
    // send otp to mail
    await registerMailService({
      username: updatedUser?.username,
      userEmail: updatedUser?.email,
      otp: code,
      type: 2,
    });
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

export const generateOTP = async (req, res) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(500).send({ msg: "Requested body is missing" });
  }

  try {
    // should check phone validate
    const OTP = generateRandomSixDigitNumber();
    const user = await UserModel.findOneAndUpdate(
      { _id: userId, is_mobile_verified: 0 },
      { otp: OTP },
      { new: true },
    );
    if (!user) {
      return res.status(404).send({ msg: "User already mobile verified." });
    }

    // req.app.locals.OTP = OTP; // need to better solution
    console.log("Phone verification otp--", OTP);
    return res.send({
      msg: "OTP sent successfully",
      code: OTP,
    });
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

export const verifyOTP = async (req, res) => {
  const { userId } = req.user;
  const { code } = req.query;

  if (!userId || !code) {
    return res.status(400).send({ msg: "Requested body is missing" });
  }

  try {
    const userExist = await UserModel.findOne({ _id: userId });
    if (!userExist) {
      return res.status(404).send({ msg: "User not found" });
    }
    if (code === userExist?.otp) {
      await UserModel.findOneAndUpdate(
        { _id: userId },
        { is_mobile_verified: 1, otp: null },
        { new: true },
      );

      return res.status(200).send({ msg: "Verify User successfully" });
    }
    return res.status(400).send({ msg: "Invalid OTP" });
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { userId } = req.user;
  console.log({ password, userId });
  if (!password || !userId) {
    return res.status(500).send({ msg: "Requested body is missing" });
  }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { password: await bcrypt.hash(password, 10) },
      { new: true }, // To return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send({ msg: "User Not Found" });
    }

    // otp generate

    return res.status(201).send({ msg: "Successfully resetting password." });
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
