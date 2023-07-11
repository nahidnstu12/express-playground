const jwt = require("jsonwebtoken");
const User = require("../schemas/UserSchema");
exports.checkLogin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );

    // const { username, _id, role } = decoded;
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log("checkLogin ", decoded);
    // req.userId = _id;
    // req.username = username;
    // req.role = role;
    req.user = user
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send(`<h1>Authorization Failed</h1>`);
  }
};
/**
 * Check Authorization Middleware
 * @param {String[]} roles
 * @returns {boolean}
 */
exports.checkAuthorize = (roles) => async (req, res, next) => {
  if (roles.includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({ message: "Not Authorized!" });
  }
};


// const collect = ((selector) => (someting) => "hi", selector);
