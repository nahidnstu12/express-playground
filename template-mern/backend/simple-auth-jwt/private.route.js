import express from "express";
import {
  deleteUserById,
  profile,
  updateUserById,
} from "./user.v2.controller.js";

const router = express.Router();

router.get("/profile", profile);
router.put("/user/:id", updateUserById);
router.delete("/user/:id", deleteUserById);
export default router;
