import express from "express";
import { createFolder, deleteFolder, getAllFolders, getFolderById, updateFolder } from "../controller/folderController";

const router = express.Router();

router.post("/", createFolder);
router.get("/", getAllFolders);
router.get("/:id", getFolderById);
router.patch("/:id", updateFolder);
router.delete("/:id", deleteFolder);

export default router;
