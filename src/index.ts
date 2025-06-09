import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;
import "./db/connection"
import { pool } from "./db/connection";
import userRoutes from "./routes/userRoutes";
import folderRoutes from "./routes/folderRoutes";
import noteRoutes from "./routes/noteRoutes";

//middleware
app.use(express.json());

//routes
app.use("/api/user", userRoutes);

//folder routes
app.use("/api/folders", folderRoutes);

//notes routes
app.use("/api/notes", noteRoutes)

// test
// app.get("/", async (req, res) => {
//   const result = await pool.query("SELECT current_database()");
//   res.send(`database: ${result.rows[0].current_database}`);
//   res.send(result);
// });

app.listen(PORT,()=>{console.log("server is running at port: ",PORT)});
