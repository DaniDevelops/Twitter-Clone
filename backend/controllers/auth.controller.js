import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenandSetCookie } from "../lib/utils/generateTokenandSetCookie.js";

export async function signup(req, res) {
  const { username, fullName, email, password } = req.body;
  try {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email Format" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be more than 8 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      password: hashedPassword,
      email,
    });

    if (newUser) {
      generateTokenandSetCookie(newUser._id, res);
      await newUser.save();

      res.status(200).json({
        userId: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error occurred during signup", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
}
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const correctPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !correctPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    generateTokenandSetCookie(user._id, res);
    res.status(200).json({
      userId: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error occurred during login", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
}
export async function logout(req, res) {
  try {
    res.cookie("auth_token", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    console.log("Error occurred during logout", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
}
export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error occurred at getMe controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
}
