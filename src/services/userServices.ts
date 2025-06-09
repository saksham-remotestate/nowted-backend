import { pool } from "../db/connection";

export const getAllUsersService = async () => {
  const result = await pool.query("SELECT id, username, email FROM users");
  return result.rows;
};

export const getUserByIdService = async (id: string) => {
  const result = await pool.query(
    "SELECT id, username, email FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const createUserService = async (
  username: string,
  email: string,
  password: string
) => {
  console.log(username, email);

  const result = await pool.query(
    "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
};

export const updateUserService = async (
  id: string,
  username: string,
  email: string
) => {
  const result = await pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email;",
    [username, email, id]
  );
  return result.rows[0];
};

export const deleteUserService = async (id: string) => {
  const result = pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING RETURNING {id, username, email}",
    [id]
  );
  return (await result).rows[0];
};
