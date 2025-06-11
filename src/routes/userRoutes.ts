import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, loginUser, updateUser } from "../controller/userController";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser)

export default router;
