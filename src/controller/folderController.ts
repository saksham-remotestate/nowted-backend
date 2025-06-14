import { Request, Response } from "express";
import { folderData } from "../interface/folder.type";
import {
  createFolderService,
  deleteFolderService,
  getAllFoldersService,
  getFolderByIdService,
  restoreFolderService,
  updateFolderService,
} from "../services/folderServices";
import { z } from "zod";

const handleResponse = (
  res: Response,
  status: number,
  message: string | any,
  folders?: folderData | folderData[] | null
) => {
  res.status(status).json({
    status,
    message,
    folders,
  });
};

const folderSchema = z.object({
  name: z
    .string({ required_error: "name is required" })
    .trim()
    .min(3, "name should be at least 3 characters long"),
});

export const createFolder = async (req: Request, res: Response) => {
  const { name } = req.body;
  const validate = folderSchema.safeParse(req.body);
  if (!validate.success) {
    return handleResponse(res, 400, validate.error);
  }
  const user_id = req.user.id;
  try {
    const newFolder = await createFolderService(name, user_id);
    handleResponse(res, 201, "Folder created successfully", newFolder);
  } catch (error) {
    console.log("createFolder: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const getAllFolders = async (req: Request, res: Response) => {
  const user_id = req.user.id;
  try {
    const folders = await getAllFoldersService(user_id);
    handleResponse(res, 200, "Folders fetched successfully", folders);
  } catch (error) {
    console.log("getAllFolders: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const getFolderById = async (req: Request, res: Response) => {
  const user_id = req.user.id;
  try {
    const folder = await getFolderByIdService(req.params.id, user_id);
    if (!folder) return handleResponse(res, 400, "Folder not found", []);
    handleResponse(res, 200, "Folder fetched successfully", folder);
  } catch (error) {
    console.log("getFolderById: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  const { name } = req.body;
  const validate = folderSchema.safeParse(req.body);
  if (!validate.success) {
    return handleResponse(res, 400, validate.error);
  }
  const user_id = req.user.id;
  try {
    const folder = await updateFolderService(req.params.id, name, user_id);
    if (!folder) return handleResponse(res, 400, "Folder not found", []);
    handleResponse(res, 200, "Folder updated successfully", folder);
  } catch (error) {
    console.log("updateFolder: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const user_id = req.user.id;
  try {
    const folder = await deleteFolderService(req.params.id, user_id);
    if (!folder) return handleResponse(res, 404, "Folder not found", []);
    handleResponse(res, 200, "Folder deleted successfully", folder);
  } catch (error) {
    console.log("deleteFolder: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const restoreFolder = async (req: Request, res: Response) => {
  const user_id = req.user.id;
  try {
    const folder = await restoreFolderService(req.params.id, user_id);
    if (!folder) return handleResponse(res, 404, "Folder not found", []);
    handleResponse(res, 200, "Folder restored successfully", folder);
  } catch (error) {
    console.log("restoreFolder: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};                                 