import express from "express";
import { getUsers, signup, login, getStats, updateUser, deleteUser } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers)
router.post("/signup", signup)
router.post("/login", login)
router.get("/stats", getStats)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router;
