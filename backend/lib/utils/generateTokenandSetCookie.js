import jwt from "jsonwebtoken";
export async function generateTokenandSetCookie(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
  res.cookie("auth_token", token, {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", //prevent CSRF attacks cross site request forgery attacks
    secure: process.env.NODE_ENV === "production",
  });
}
