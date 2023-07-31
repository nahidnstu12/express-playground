import bcrypt from "bcryptjs";
import req from "express/lib/request.js";
import res from "express/lib/response.js";
import jwt from "jsonwebtoken";
import { ROLES } from "./constant.js";
import UserModel from "./user.model.js";

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

    const token = await jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("verification token=>", token);

    res.status(201).send({
      msg: "Successfully Registered",
      ref: token,
    });
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
    const parsedToken = await jwt.verify(ref, process.env.JWT_SECRET);
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

    res.status(200).send({ msg: "verification successful" });
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

      // if (!user) {
      //   return res.status(404).send({ msg: "Invalid request" });
      // }

      return res.status(200).send({ msg: "Verify User successfully" });
    }
    return res.status(400).send({ msg: "Invalid OTP" });
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
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { phone },
      { new: true }, // To return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send({ msg: "User Not Found" });
    }

    // otp generate

    return res.status(201).send({ msg: "Record is updated." });
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { userId } = req.user;
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

export const registerMail = (req, res) => {};
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

function generateRandomSixDigitNumber() {
  const min = 100000; // Minimum 6-digit number (100000)
  const max = 999999; // Maximum 6-digit number (999999)

  // Generate a random number between min and max (inclusive)
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  // Convert the number to a string
  let numberString = randomNumber.toString();

  // Split the string into an array of characters
  let numberArray = numberString.split("");

  // Shuffle the array using Fisher-Yates (Knuth) shuffle algorithm
  for (let i = numberArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numberArray[i], numberArray[j]] = [numberArray[j], numberArray[i]];
  }

  // Join the shuffled array back into a string
  return numberArray.join("");
}
