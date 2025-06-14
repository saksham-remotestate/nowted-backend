import { pool } from "../db/connection";

export const getAllFoldersService = async (user_id: string) => {
  const result = await pool.query(
    "SELECT id, name, created_at FROM folders WHERE user_id = $1 AND archived_at IS NULL",
    [user_id]
  );
  return result.rows;
};

export const getFolderByIdService = async (id: string, user_id: string) => {
  const result = await pool.query(
    "SELECT id, name, created_at FROM folders WHERE user_id = $1 AND id = $2 AND archived_at IS NULL",
    [user_id, id]
  );
  return result.rows[0];
};

export const createFolderService = async (name: string, user_id: string) => {
  const result = await pool.query(
    "INSERT INTO folders(name,user_id) VALUES($1, $2) RETURNING  id, name, created_at",
    [name, user_id]
  );
  return result.rows[0];
};

export const updateFolderService = async (
  id: string,
  name: string,
  user_id: string
) => {
  const result = await pool.query(
    "UPDATE folders SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING  id, name, created_at",
    [name, id, user_id]
  );
  return result.rows[0];
};

export const deleteFolderService = async (id: string, user_id: string) => {
  await pool.query("Begin");
  const result = await pool.query(
    "UPDATE folders SET archived_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING  id",
    [id, user_id]
  );
  const result2 = await pool.query(
    "UPDATE notes SET archived_at = CURRENT_TIMESTAMP WHERE folder_id = $1 AND user_id = $2 RETURNING  id",
    [id, user_id]
  );
  await pool.query("Commit");
  return result.rows[0];
};  

export const restoreFolderService = async (id: string, user_id: string) => {
  const result = await pool.query(
    "UPDATE folders SET archived_at = null WHERE id = $1 AND user_id = $2 RETURNING  id, name, created_at",
    [id, user_id]
  );
  return result.rows[0];
};
