import express from "express";
import { Auth } from "./middleware.js";
import {
  deleteUserById,
  profile,
  updateSelfUser,
} from "./user.v2.controller.js";

const router = express.Router();

router.get("/profile", profile);
router.put("/user/update", Auth, updateSelfUser);
router.delete("/user/:id", Auth, deleteUserById);
export default router;
