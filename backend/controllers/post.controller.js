import Notification from "../models/notifications.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export async function createPost(req, res) {
  const { text } = req.body;
  let { image } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!text && !image) {
      return res
        .status(401)
        .json({ message: "Post must contain either text or image" });
    }
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      userId,
      text,
      image,
    });

    await newPost.save;
    res.status(200).json(newPost);
  } catch (error) {
    console.log("Error occurred at createPost: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deletePost(req, res) {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (post.userId.toString() !== req.user._id) {
      return res
        .status(401)
        .json({ message: "cannot delete this post, it doesn't belong to you" });
    }
    if (post.img) {
      imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "post deleted Successfully" });
  } catch (error) {
    console.log("error occured in deletePost: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function commentPost(req, res) {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.user._id;
  try {
    if (!text) {
      return res.status(401).json({ message: "comment must include texts" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const comment = { userId, text };
    post.comment.push(comment);
    await post.save();
    const updatedComments = post.comment;
    res.status(200).json(updatedComments);
  } catch (error) {
    console.log("Error occured at commentPost: ", error.messsage);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function toggleLike(req, res) {
  const postId = req.params.id;
  const userId = req.user._id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      post.likes.push(userId);
      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.userId,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error occured at toggleLikes: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        selected: "-password",
      })
      .populate({
        path: "comments.userId",
        selected: "-password",
      });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(201).json(posts);
  } catch (error) {
    console.log("Error occored at getAllPosts", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLikedPosts(req, res) {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const likedPosts = await Post.findById({ _id: { $in: user.likedPosts } })
      .populate({
        path: "UserId",
        selected: "-password",
      })
      .populate({
        path: "comments.userId",
        selected: "-password",
      });
    if (!likedPosts) {
      return res.status(404).json({ message: "posts not found" });
    }
    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error occored at getLikedPosts", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFollowingPosts(req, res) {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const following = user.following;
    const followingPosts = await Post.findById({ _id: { $in: following } })
      .populate({
        path: "UserId",
        selected: "-password",
      })
      .populate({
        path: "comments.userId",
        selected: "-password",
      });
    if (!likedPosts) {
      return res.status(404).json({ message: "posts not found" });
    }
    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error occored at getFollowingPosts", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserPosts(req, res) {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPosts = await Post.findById(user._id)
      .populate({
        path: "UserId",
        selected: "-password",
      })
      .populate({
        path: "comments.userId",
        selected: "-password",
      });
    if (!userPosts) {
      return res.status(404).json({ message: "posts not found" });
    }
    res.status(200).json(userPosts);
  } catch (error) {
    console.log("Error occored at getUserPosts", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
