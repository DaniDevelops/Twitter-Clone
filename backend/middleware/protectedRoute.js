import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function protectedRoute(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error occurred at protectedRoute", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
}
