import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;
import "./db/connection"
import { pool } from "./db/connection";
import userRoutes from "./routes/userRoutes";

//middleware
app.use(express.json());

//routes
app.use("/api/user", userRoutes);

// test
// app.get("/", async (req, res) => {
//   const result = await pool.query("SELECT current_database()");
//   res.send(`database: ${result.rows[0].current_database}`);
//   res.send(result);
// });

app.listen(PORT,()=>{console.log("server is running at port: ",PORT)});
