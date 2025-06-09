import { pool } from "../db/connection";

const TEMPORARY_ID = "c293042d-7bb9-4477-bd0f-01cee63f41c6";

export const getAllNotesService = async () => {
  const result = await pool.query(
    "SELECT n.id, n.folder_id AS folderId, n.title, n.is_favorite AS isFavorite, n.is_archive AS isArchive, n.created_at AS createdAt, n.updated_at AS updatedAt, n.archived_at AS deletedAt, SUBSTRING(content, 1, 20) AS preview, f.id AS idF, f.name, f.created_at AS createdAtF, f.updated_at AS updatedAtF, f.archived_at AS deletedAtF FROM notes n JOIN folders f ON f.id = n.folder_id WHERE n.user_id = $1",
    // "SELECT n.id, n.folder_id AS folderId, n.title, n.is_favorite AS isFavorite, n.is_archive AS isArchive, n.created_at AS createdAt, n.updated_at AS updatedAt, n.archived_at AS deletedAt, SUBSTRING(content, 1, 20) AS preview,  (SELECT row_to_json() folders FROM (SELECT * FROM folders)) FROM notes n JOIN folders f ON f.id = n.folder_id WHERE n.user_id = $1",
    [TEMPORARY_ID]
  );
  return result.rows;
};

export const getNoteByIdService = async (id: string) => {
  const result = await pool.query(
    "SELECT n.id, n.folder_id AS folderId, n.title, n.content, n.is_favorite AS isFavorite, n.is_archive AS isArchive, n.created_at AS createdAt, n.updated_at AS updatedAt, n.archived_at AS deletedAt, f.id AS idF, f.name, f.created_at AS createdAtF, f.updated_at AS updatedAtF, f.archived_at AS deletedAtF FROM notes n JOIN folders f ON f.id = n.folder_id WHERE n.user_id = $1 AND n.id = $2",
    [TEMPORARY_ID, id]
  );
  return result.rows[0];
};

export const getRecentNotesService = async () => {
  const result = await pool.query(
    "SELECT n.id, n.folder_id AS folderId, n.title, n.is_favorite AS isFavorite, n.is_archive AS isArchive, n.created_at AS createdAt, n.updated_at AS updatedAt, n.archived_at AS deletedAt, SUBSTRING(content, 1, 20) AS preview, f.id AS idF, f.name, f.created_at AS createdAtF, f.updated_at AS updatedAtF, f.archived_at AS deletedAtF FROM notes n JOIN folders f ON f.id = n.folder_id WHERE n.user_id = $1 ORDER BY n.updated_at DESC LIMIT 3",
    [TEMPORARY_ID]
  );
  return result.rows;
};
