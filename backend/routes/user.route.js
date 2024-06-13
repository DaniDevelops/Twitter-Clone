import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  getSuggestedUsers,
  getUserProfile,
  toggleFollowing,
  updateUserProfile,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.post("/follow/:userId", protectedRoute, toggleFollowing);
router.get("/suggested", protectedRoute, getSuggestedUsers);
router.post("/update", protectedRoute, updateUserProfile);

export default router;
