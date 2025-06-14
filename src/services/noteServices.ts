import { pool } from "../db/connection";

export const getAllNotesService = async (
  archived: string,
  favorite: string,
  deleted: string,
  folderId: string,
  page: number,
  limit: number,
  search: string,
  user_id: string,
) => {
  const conditionalQuery =
    archived === "false"
      ? favorite === "false"
        ? " and (n.is_archive = false or n.is_favorite = true)"
        : " and (n.is_archive = false and n.is_favorite = true)"
      : "and (n.is_archive = true)";

  const trashNotes =
    deleted === "true"
      ? "AND n.archived_at IS NOT NULL "
      : "AND n.archived_at IS NULL ";

  const offset = page * limit - 10;

  const mainQuery = `
    SELECT
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
  WHERE n.user_id = $1 and n.folder_id = $2
  AND (title ILIKE '%${search}%' OR content ILIKE '%${search}%')
  `;

  const query =
    mainQuery +
    conditionalQuery +
    trashNotes +
    ` offset ${offset}  limit ${limit}`;

  const result = await pool.query(query, [user_id, folderId]);

  return result.rows;
};

export const getNoteByIdService = async (id: string, user_id: string) => {
  const result = await pool.query(
    `SELECT
    n.id,
    n.folder_id AS "folderId",
    n.title,
    n.content,
    n.is_favorite AS "isFavorite",
    n.is_archive AS "isArchive",
    n.created_at AS "createdAt",
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
    [user_id, id]
  );
  return result.rows[0];
};

export const getRecentNotesService = async (user_id: string) => {
  const result = await pool.query(
    `SELECT
    n.id,
    n.folder_id AS "folderId",
    n.title,
    n.is_favorite AS "isFavorite",
    n.is_archive AS "isArchive",
    n.created_at AS "createdAt",
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
    [user_id]
  );
  return result.rows;
};

export const createNoteService = async (
  folder_id: string,
  title: string,
  content: string,
  is_favorite: boolean,
  is_archive: boolean,
  user_id: string
) => {
  const result = await pool.query(
    "INSERT INTO notes(folder_id, title, content, is_favorite, is_archive, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
    [folder_id, title, content, is_favorite, is_archive, user_id]
  );
  return result.rows[0];
};

export const updateNoteService = async (
  folder_id: string,
  title: string,
  content: string,
  is_favorite: boolean,
  is_archive: boolean,
  id: string,
  user_id: string
) => {
  const result = await pool.query(
    "UPDATE notes SET folder_id = $1, title = $2, content = $3, is_favorite = $4, is_archive = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND user_id = $7 RETURNING id",
    [folder_id, title, content, is_favorite, is_archive, id, user_id]
  );
  return result.rows[0];
};

export const deleteNoteService = async (id: string, user_id: string) => {
  const result = await pool.query(
    "UPDATE notes SET archived_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, user_id]
  );
  return result.rows[0];
};

export const restoreNoteService = async (id: string, user_id: string) => {
  const result = await pool.query(
    "UPDATE notes SET archived_at = null WHERE id = $1 RETURNING id",
    [id, user_id]
  );
  return result.rows[0];
};
