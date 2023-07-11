const {
  getUser,
  addUser,
  removeUser,
  getSingleUser,
  updateUser,
} = require("../controller/userController");
const {
  checkLogin,
  checkAuthorizeRoles,
  checkSelfAuthorize,
} = require("../middleware/verifyToken");
const {
  addUserValidators,
  addUserValidationHandler,
  updateUserValidators,
  updateUserValidationHandler,
} = require("../validation/UserValidation");

const router = require("express").Router();

router.get("/health", async (req, res) => {
  try {
    res.status(200).send("<h1>Hello Nahid</h1>");
  } catch (err) {
    console.log(err);
    res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
});

router.post(
  "/",
  addUserValidators,
  addUserValidationHandler,
  checkLogin,
  checkAuthorizeRoles(["admin"]),
  addUser
);
router.get("/", getUser);
router.get(
  "/:id",
  checkLogin,
  checkSelfAuthorize,
  // checkAuthorizeRoles(["admin", "customer"]),
  getSingleUser
);
router.put(
  "/:id",
  updateUserValidators,
  updateUserValidationHandler,
  checkLogin,
  checkSelfAuthorize,
  updateUser
);
router.delete("/:id", checkLogin, checkAuthorizeRoles(["admin"]), removeUser);
module.exports = router;
