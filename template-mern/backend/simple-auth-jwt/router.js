import express from "express";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", registerUser);
export default router;
