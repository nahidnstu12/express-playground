import express from "express";
import { loginUser, registerUser } from "./user.v2.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
export default router;
