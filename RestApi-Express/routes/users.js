var express = require('express');
const { signup, login, fetchUser } = require('../controller/userController');
var router = express.Router();

/* GET users listing. */
router.get("/health", async (req, res) => {
  try {
    res.status(200).send("<h1>Hello Nahid</h1>");
  } catch (err) {
    console.log(err);
    res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
});

router.post("/signup", signup)
router.post("/login", login)
router.get("/all", fetchUser)

module.exports = router;
