const router = require("express").Router();

const { register, login } = require("../controller/authController");
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../validation/loginValidation");
const { addUserValidators, addUserValidationHandler } = require("../validation/UserValidation");

//REGISTER
router.post("/register",addUserValidators,addUserValidationHandler, register);

//LOGIN
router.post("/login", doLoginValidators, doLoginValidationHandler, login);

//LOGOUT

module.exports = router;
