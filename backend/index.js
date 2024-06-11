import express from "express";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDb from "./Db/connectMongoDb.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use("/api/auth", authRoutes);

app.listen(2024, () => {
  console.log("Server is running on port 2024");
  connectMongoDb();
});
