const jwt = require("jsonwebtoken");
exports.checkLogin = async (req, res, next) => {
    
  try {
    const { authorization } = req.headers;
    const decoded = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    const { username, _id } = decoded;
    console.log("tt ",decoded)
    req.userId = _id
    req.username = username
    next()
  } catch (err) {
    console.log(err);
    res.status(401).send(`<h1>Authorization Failed</h1>`);
  }
};
