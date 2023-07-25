import express from "express";
import { Auth, localVariables } from "./middleware.js";
import {
  deleteUserById,
  emailVerification,
  generateOTP,
  profile,
  updateSelfUser,
  verifyOTP,
} from "./user.v2.controller.js";

const router = express.Router();

router.get("/profile", profile);
router.put("/user/update", Auth, updateSelfUser);
router.delete("/user/:id", Auth, deleteUserById);
router.get("/generate-otp", localVariables, generateOTP);
router.get("/verify-otp", localVariables, verifyOTP);
router.get("/email-verify", emailVerification);
export default router;
