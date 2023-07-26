import express from "express";
import { Auth, localVariables } from "./middleware.js";
import {
  deleteUserById,
  emailVerification,
  generateOTP,
  phoneVerification,
  profile,
  resetPassword,
  updateSelfUser,
  verifyOTP,
} from "./user.v2.controller.js";

const router = express.Router();

router.get("/profile", profile);
router.put("/user/update", Auth, updateSelfUser);
router.delete("/user/:id", Auth, deleteUserById);

router.get("/email-verify", emailVerification);

router.get("/phone-verify", Auth, phoneVerification);
router.get("/generate-otp", Auth, localVariables, generateOTP);
router.get("/verify-otp", Auth, verifyOTP);

router.put("/reset-password", Auth, resetPassword);
export default router;
