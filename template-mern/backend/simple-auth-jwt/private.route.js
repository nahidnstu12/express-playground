import express from "express";
import { profile } from "./user.controller.js";

const router = express.Router();

router.get("/profile", profile);
export default router;
