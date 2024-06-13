import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import Notification from "../models/notifications.model.js";
import User from "../models/user.model.js";

export async function getUserProfile(req, res) {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("error occured at getUserProfile: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function toggleFollowing(req, res) {
  const { userId } = req.params;
  try {
    const userToModify = await User.findById(userId).select("-password");
    const currentUser = await User.findById(req.user._id);
    if (userId === req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "cannot follow/unfollow yourself" });
    }
    if (!userToModify || !currentUser) {
      res.status(404).json({ message: "User not found" });
    }
    const isFollowing = currentUser.following.includes(userId);
    if (isFollowing) {
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userId },
      });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: userId },
      });
      const notification = new Notification({
        from: req.user._id,
        to: userId,
        type: "follow",
      });
      await notification.save();
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("error occured at toggleFollowing: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSuggestedUsers(req, res) {
  const userId = req.user._id;
  try {
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate(
      {
        match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } }
    );
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 5);
    suggestedUsers.forEach((user) => user.password === null);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error occured at getSuggestedUsers: ", error.message);
    res.statsus(500).json({ message: "Internal Server Error" });
  }
}

export async function updateUserProfile(req, res) {
  const { username, fullName, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if ((!newPassword && currentPassword) || (newPassword && currentPassword)) {
      return res.status(401).json({
        message:
          "Please provide both the current password and the new password",
      });
    }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "passwords do not match" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();
    user.password === null;

    res.status(200).json(user);
  } catch (error) {
    console.log("Error occured at updateUserProfile: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
