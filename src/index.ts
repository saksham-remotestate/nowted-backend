import "dotenv/config";
import express from "express";
import "./db/connection";
import folderRoutes from "./routes/folderRoutes";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();
const PORT = process.env.PORT || 8000;

//middleware
app.use(express.json());

//routes
app.use("/api/user", userRoutes);

//folder routes
app.use("/api/folders", authMiddleware, folderRoutes);

//notes routes
app.use("/api/notes", authMiddleware, noteRoutes);

// test
// app.get("/", async (req, res) => {
//   const result = await pool.query("SELECT current_database()");
//   res.send(`database: ${result.rows[0].current_database}`);
//   res.send(result);
// });

app.listen(PORT, () => {
  console.log("server is running at port: ", PORT);
});
