const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userSchemas");

exports.register = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hased = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    ...req.body,
    password: hased,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log("Debug =>", err);
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { username: req.body.username }],
    });
    !user && res.status(401).json("Authetication failed!");
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      res.status(401).json({
        error: "Authetication failed!",
      });
    } else {
      const token = jwt.sign(
        {
          username: user.username,
          _id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIARY }
      );
      const { password, ...others } = user._doc;

      res.status(200).json({ ...others, token });
    }
  } catch (err) {
    console.log("Debug =>", err);
    res.status(500).json(err);
  }
};
