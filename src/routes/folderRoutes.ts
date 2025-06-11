import express from "express";
import { createFolder, deleteFolder, getAllFolders, getFolderById, restoreFolder, updateFolder } from "../controller/folderController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", createFolder);
router.get("/", authMiddleware, getAllFolders);
router.get("/:id", getFolderById);
router.patch("/:id", updateFolder);
router.delete("/:id", deleteFolder);
router.patch("/:id/restore", restoreFolder)

export default router;
    