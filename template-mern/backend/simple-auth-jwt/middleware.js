import jwt from "jsonwebtoken";
import UserModel from "./user.model.js";

export const Auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(500).send({ msg: "Authorization header missing." });
  }
  try {
    const parsedToken = authorization.split(" ")[1];

    const tokenData = await jwt.verify(parsedToken, process.env.JWT_SECRET);

    const userData = await UserModel.findOne({
      _id: tokenData?.userId,
    });

    if (!userData) {
      return res.status(500).send({ msg: "Authentication Failed." });
    }
    // we can send authenticated user data using this route
    req.user = {
      userId: userData?._id,
      username: userData?.username,
      email: userData?.email,
      role: userData?.role,
    };

    next();
  } catch (err) {
    return res.status(500).send({ msg: err, dev_note: "token error" });
  }
};

export const localVariables = (req, res, next) => {
  try {
    req.app.locals = {
      OTP: null,
      resetSession: false,
    };
    next();
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};
// Utitly Functions
/*

*/
