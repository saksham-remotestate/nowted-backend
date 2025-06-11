import express from "express";
import { createFolder, deleteFolder, getAllFolders, getFolderById, restoreFolder, updateFolder } from "../controller/folderController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getAllFolders);
router.get("/:id", authMiddleware, getFolderById);
router.patch("/:id", authMiddleware, updateFolder);
router.delete("/:id", authMiddleware, deleteFolder);
router.patch("/:id/restore", authMiddleware, restoreFolder)

export default router;
    