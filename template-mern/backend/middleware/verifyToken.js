const jwt = require("jsonwebtoken");
const User = require("../models/userSchemas");

exports.checkLogin = async (req, res, next) => {
  console.log("ckLoging");
  try {
    const { authorization } = req.headers;
    //    console.log({
    //      token: authorization.split(" ")[1],
    //      sec: process.env.JWT_SECRET,
    //      time: process.env.JWT_EXPIARY,
    //    });
    if (!authorization) {
      return res
        .status(401)
        .json({ message: "You are not authorized to do this action" });
    }
    const decoded = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // console.log("checkLogin ", decoded);
    req.user = user;
    next();
  } catch (err) {
    console.log("checklogin =>", err);
    res.status(401).send(`<h1>Authorization Failed</h1>`);
  }
};
exports.checkSelfAuthorize = async (req, res, next) => {
  console.log("checkSelfAuthorize");
  console.log({ id: req.user.id, _id: req.params.id, role: req.user.role });
  try {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  } catch (err) {
    console.log(err);
  }
};
exports.checkAuthorizeRoles = (roles) => async (req, res, next) => {
  console.log("checkAuthorizeRoles");
  // console.log("roles=>", roles, req.user.role);
  if (roles.includes(req.user.role)) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to do this action" });
  }
};

// another way {isAdmin: false}
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

exports.verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

exports.verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};
