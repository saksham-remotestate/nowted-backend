import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById, getRecentNotes, restoreNote, updateNote } from "../controller/noteController";

const router = express.Router();

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/recent", getRecentNotes)
router.get("/:id", getNoteById);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/restore", restoreNote)

export default router;