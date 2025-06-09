import express from "express";
import { getAllNotes, getNoteById, getRecentNotes } from "../controller/noteController";

const router = express.Router();

// router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/recent", getRecentNotes)
router.get("/:id", getNoteById);
// router.patch("/:id", updateNote);
// router.delete("/:id", deleteNote);
// router.patch("/:id/restore", restoreNote)

export default router;