import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  toggleLike,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.get("/liked/:id", protectedRoute, getLikedPosts);
router.get("/user/:username", protectedRoute, getUserPosts);
router.post("/create-post", protectedRoute, createPost);
router.delete("/:id", protectedRoute, deletePost);
router.post("/comment/:id", protectedRoute, commentPost);
router.post("/like/:id", protectedRoute, toggleLike);

export default router;
