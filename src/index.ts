import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;
import "./db/connection"

//middleware
app.use(express.json());

app.listen(PORT,()=>{console.log("server is running at port: ",PORT)});
