import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getRefreshToken,
  getUserById,
  loginUser,
  logoutUser,
  updateUser,
} from "../controller/userController";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/token", getRefreshToken);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
