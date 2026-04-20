import express from "express";
import { getUsers, signup, login, getStats } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers)
router.post("/signup", signup)
router.post("/login", login)
router.get("/stats", getStats)

export default router;
