const User = require("../schemas/UserSchema");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hased = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hased });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.log("Debug ", err);
    res.send(`<h1>${err._message}</h1>`);
  }
};
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (!user) {
      res.status(200).json({ msg: "Users not found" });
    }

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
        { username: user.username, fullname: user.fullname, _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        access_token: token,
        message: "Login successful!",
      });
    }
  } catch (err) {
    console.log("Debug ", err);
    res.send(`<h1>${err._message}</h1>`);
  }
};
