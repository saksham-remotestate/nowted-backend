import { pool } from "../db/connection";

const TEMPORARY_ID = "c293042d-7bb9-4477-bd0f-01cee63f41c6";

export const getAllNotesService = async () => {
  const result = await pool.query(
    // "SELECT n.id, n.folder_id AS folderId, n.title, n.is_favorite AS isFavorite, n.is_archive AS isArchive, n.created_at AS createdAt, n.updated_at AS updatedAt, n.archived_at AS deletedAt, SUBSTRING(content, 1, 20) AS preview, f.id AS idF, f.name, f.created_at AS createdAtF, f.updated_at AS updatedAtF, f.archived_at AS deletedAtF FROM notes n JOIN folders f ON f.id = n.folder_id WHERE n.user_id = $1 AND n.archived_at IS NULL",
    // "SELECT n.id, n.folder_id AS folderId, n.title, n.is_favorite AS isFavorite, n.is_archive AS isArchive, n.created_at AS createdAt, n.updated_at AS updatedAt, n.archived_at AS deletedAt, SUBSTRING(content, 1, 20) AS preview,  (SELECT row_to_json() folders FROM (SELECT * FROM folders)) FROM notes n JOIN folders f ON f.id = n.folder_id WHERE n.user_id = $1",
    `SELECT
  n.id,
  n.folder_id AS "folderId",
  n.title,
  n.is_favorite AS "isFavorite",
  n.is_archive AS "isArchive",
  n.created_at AS "createdAt",
  n.updated_at AS "updatedAt",
  n.archived_at AS "deletedAt",
  SUBSTRING(content, 1, 20) AS preview,
  json_build_object(
    'id', f.id,
    'name', f.name,
    'createdAt', f.created_at,
    'updatedAt', f.updated_at,
    'deletedAt', f.archived_at
  ) as folder 
FROM notes n
JOIN folders f ON f.id = n.folder_id
WHERE n.user_id = $1 AND n.archived_at IS NULL`,
    [TEMPORARY_ID]
  );
  return result.rows;
};

export const getNoteByIdService = async (id: string) => {
  const result = await pool.query(
    `SELECT
  n.id,
  n.folder_id AS "folderId",
  n.title,
  n.content,
  n.is_favorite AS "isFavorite",
  n.is_archive AS "isArchive",
  n.created_at AS "createdAt",
  n.updated_at AS "updatedAt",
  n.archived_at AS "deletedAt",
  json_build_object(
    'id', f.id,
    'name', f.name,
    'createdAt', f.created_at,
    'updatedAt', f.updated_at,
    'deletedAt', f.archived_at
  ) as folder 
FROM notes n
JOIN folders f ON f.id = n.folder_id AND f.archived_at IS NULL
WHERE n.user_id = $1 AND n.archived_at IS NULL AND n.id = $2`,
    [TEMPORARY_ID, id]
  );
  return result.rows[0];
};

export const getRecentNotesService = async () => {
  const result = await pool.query(
    // "SELECT n.id, n.folder_id AS folderId, n.title, n.is_favorite AS isFavorite, n.is_archive AS isArchive, n.created_at AS createdAt, n.updated_at AS updatedAt, n.archived_at AS deletedAt, SUBSTRING(content, 1, 20) AS preview, f.id AS idF, f.name, f.created_at AS createdAtF, f.updated_at AS updatedAtF, f.archived_at AS deletedAtF FROM notes n JOIN folders f ON f.id = n.folder_id WHERE n.user_id = $1 AND n.archived_at IS NULL ORDER BY n.updated_at DESC LIMIT 3",
    `SELECT
    n.id,
    n.folder_id AS "folderId",
    n.title,
    n.is_favorite AS "isFavorite",
    n.is_archive AS "isArchive",
    n.created_at AS "createdAt",
    n.updated_at AS "updatedAt",
    n.archived_at AS "deletedAt",
    SUBSTRING(content, 1, 20) AS preview,
    json_build_object(
      'id', f.id,
      'name', f.name,
      'createdAt', f.created_at,
      'updatedAt', f.updated_at,
      'deletedAt', f.archived_at
    ) as folder
  FROM notes n
  JOIN folders f ON f.id = n.folder_id
  WHERE n.user_id = $1 AND n.archived_at IS NULL
  ORDER BY n.updated_at DESC LIMIT 3`,
    [TEMPORARY_ID]
  );
  return result.rows;
};

export const createNoteService = async (
  folder_id: string,
  title: string,
  content: string,
  is_favorite: boolean,
  is_archive: boolean
) => {
  const result = await pool.query(
    "INSERT INTO notes(folder_id, title, content, is_favorite, is_archive, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
    [folder_id, title, content, is_favorite, is_archive, TEMPORARY_ID]
  );
  return result.rows[0];
};

export const updateNoteService = async (
  folder_id: string,
  title: string,
  content: string,
  is_favorite: boolean,
  is_archive: boolean,
  id: string
) => {
  const result = await pool.query(
    "UPDATE notes SET folder_id = $1, title = $2, content = $3, is_favorite = $4, is_archive = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING id",
    [folder_id, title, content, is_favorite, is_archive, id]
  );
  return result.rows[0];
};

export const deleteNoteService = async (id: string) => {
  const result = await pool.query(
    "UPDATE notes SET archived_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0];
};

export const restoreNoteService = async (id: string) => {
  const result = await pool.query(
    "UPDATE notes SET archived_at = null WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0];
};
