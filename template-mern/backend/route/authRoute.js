import express from "express";
import { register, login } from "../controller/authController.js";
import {
  doLoginValidators,
  doLoginValidationHandler,
} from "../validation/loginValidation.js";
import {
  addUserValidators,
  addUserValidationHandler,
} from "../validation/UserValidation.js";

const router = express.Router();


//REGISTER
router.post("/register",addUserValidators,addUserValidationHandler, register);

//LOGIN
router.post("/login", doLoginValidators, doLoginValidationHandler, login);

//LOGOUT

export default router;
