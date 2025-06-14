import { folderData } from "./folder.type";


export interface noteType {
  id: string;
  folderId: string;
  title: string;
  isFavorite: string;
  isArchive: boolean;
  createdAt: boolean;
  updatedAt: string;
  deletedAt: string;
  preview?: string;
  content?: string;
  folders: folderData
}
