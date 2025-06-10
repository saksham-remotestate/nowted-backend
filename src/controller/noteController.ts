import { Request, Response } from "express";
import {
  createNoteService,
  deleteNoteService,
  getAllNotesService,
  getNoteByIdService,
  getRecentNotesService,
  restoreNoteService,
  updateNoteService,
} from "../services/noteServices";
import { z } from "zod";

const noteSchema = z.object({
  folderId: z.string({ required_error: "folder_id is required" }).uuid(),
  title: z
    .string({ required_error: "title is required" })
    .trim()
    .min(1, "title should be at least 1 character long"),
  content: z.string({ required_error: "content is required" }),
  isFavorite: z.boolean({ required_error: "is_favorite is required" }),
  isArchive: z.boolean({ required_error: "is_archive is required" }),
});

const handleResponse = (
  res: Response,
  status: number,
  message: string | any,
  notes?: any | null
) => {
  res.status(status).json({
    status,
    message,
    notes,
  });
};

export const getAllNotes = async (req: Request, res: Response) => {
  // const { archived, favorite, deleted, folderId, page, limit, search } = req.query;
  const archived = req.query.archived?.toString() || "false";
  const favorite = req.query.favorite?.toString() || "false";
  const deleted = req.query.deleted?.toString() || "false";
  const folderId = req.query.folderId?.toString() || null;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search?.toString() || "";
  try {
    if (!folderId) {
      console.log("Folder Id is required");``
      return handleResponse(res, 400, "Folder ID is required");
    }

    const notes = await getAllNotesService(
      archived,
      favorite,
      deleted,
      folderId,
      page,
      limit,
      search
    );
    handleResponse(res, 200, "Notes fetched successfully", {
      notes,
      count: notes.length,
    });
  } catch (error) {
    console.log("getAllNotes: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await getNoteByIdService(req.params.id);
    if (!note) return handleResponse(res, 400, "Note not found", []);
    handleResponse(res, 200, "Note fetched successfully", note);
  } catch (error) {
    console.log("getNoteById: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const getRecentNotes = async (req: Request, res: Response) => {
  try {
    const notes = await getRecentNotesService();
    handleResponse(res, 200, "Notes fetched successfully", notes);
  } catch (error) {
    console.log("getRecentNotes: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const createNote = async (req: Request, res: Response) => {
  const { folderId, title, content, isFavorite, isArchive } = req.body;
  const validate = noteSchema.safeParse(req.body);
  if (!validate.success) {
    return handleResponse(res, 400, validate.error);
  }
  try {
    const newNote = await createNoteService(
      folderId,
      title,
      content,
      isFavorite,
      isArchive
    );
    handleResponse(res, 201, "Note created successfully", newNote);
  } catch (error) {
    console.log("createNote: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const updateNote = async (req: Request, res: Response) => {
  const { folderId, title, content, isFavorite, isArchive } = req.body;
  const validate = noteSchema.safeParse(req.body);
  if (!validate.success) {
    return handleResponse(res, 400, validate.error);
  }
  try {
    const note = await updateNoteService(
      folderId,
      title,
      content,
      isFavorite,
      isArchive,
      req.params.id
    );
    if (!note) return handleResponse(res, 400, "Note not found", []);
    handleResponse(res, 200, "Note updated successfully");
  } catch (error) {
    console.log("updateNote: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = deleteNoteService(req.params.id);
    if (!note) return handleResponse(res, 400, "Note not found", []);
    handleResponse(res, 200, "Note deleted successfully");
  } catch (error) {
    console.log("deleteNote: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const restoreNote = async (req: Request, res: Response) => {
  try {
    const note = restoreNoteService(req.params.id);
    if (!note) return handleResponse(res, 400, "Note not found", []);
    handleResponse(res, 200, "Note restored successfully");
  } catch (error) {
    console.log("restoreNote: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};
