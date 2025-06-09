import { pool } from "../db/connection";

const TEMPORARY_ID = "c293042d-7bb9-4477-bd0f-01cee63f41c6";

export const getAllFoldersService = async () => {
  const result = await pool.query(
    "SELECT id, name, created_at, updated_at, archived_at FROM folders WHERE user_id = $1",
    [TEMPORARY_ID]
  );
  return result.rows;
};

export const getFolderByIdService = async (id: string) => {
  const result = await pool.query(
    "SELECT id, name, created_at, updated_at, archived_at FROM folders WHERE user_id = $1 AND id = $2",
    [TEMPORARY_ID, id]
  );
  return result.rows[0];
};

export const createFolderService = async (name: string) => {
  const result = await pool.query(
    "INSERT INTO folders(name,user_id) VALUES($1, $2) RETURNING  id, name, created_at, updated_at, archived_at",
    [name, TEMPORARY_ID]
  );
  return result.rows[0];
};

export const updateFolderService = async (id: string, name: string) => {
  const result = await pool.query(
    "UPDATE folders SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING  id, name, created_at, updated_at, archived_at",
    [name, id, TEMPORARY_ID]
  );
  return result.rows[0];
};

export const deleteFolderService = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM folders WHERE id = $1 RETURNING id, name, created_at, updated_at, archived_at",
    [id]
  );
  return result.rows[0];
};
