import express from "express";
import { getAllUsers, registerUser } from "./user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", registerUser);
export default router;
