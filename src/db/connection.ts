import { Pool } from "pg";

const poolConfig = {
  host: process.env.DB_HOST ?? "",
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  port: Number(process.env.DB_PORT) ?? "",
  database: process.env.DB_NAME ?? "",
};

export const pool = new Pool(poolConfig);

async function dbConnection() {
  try {
    const client = await pool.connect();
    console.log("db connected successfully");
  } catch (error) {
    console.error("db not connected");
  }
};

(() => {
  dbConnection();
})();
