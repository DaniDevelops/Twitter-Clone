import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import connectMongoDb from "./Db/connectMongoDb.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY,
  api_key: process.env.CLOUDINARY,
  api_secret: process.env.CLOUDINARY,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(2024, () => {
  console.log("Server is running on port 2024");
  connectMongoDb();
});
