import User from "./user.model.js";

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
    const users = await User.find();
    res.status(200).send({ data: users, total: users?.length });
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
