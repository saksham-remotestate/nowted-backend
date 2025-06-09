import { Request, Response } from "express";
import { getAllNotesService, getNoteByIdService, getRecentNotesService } from "../services/noteServices";

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
  try {
    const notes = await getAllNotesService();
    handleResponse(res, 200, "Notes fetched successfully", notes);
  } catch (error) {
    console.log("getAllNotes: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const getNoteById = async (req: Request, res: Response) => {
    try {
        const note = await getNoteByIdService(req.params.id);
        if (!note) return handleResponse(res, 400, "Note not found", [])
        handleResponse(res, 200, "Note fetched successfully", note)
    } catch (error) {
        console.log("getNoteById: ", error);
        handleResponse(res, 500, "Internal server error");
    }
}

export const getRecentNotes = async (req: Request, res: Response) => {
  try {
    const notes = await getRecentNotesService();
    handleResponse(res, 200, "Notes fetched successfully", notes);
  } catch (error) {
    console.log("getAllNotes: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};


