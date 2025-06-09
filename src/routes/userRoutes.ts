import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controller/userController";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
