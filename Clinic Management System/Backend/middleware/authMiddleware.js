import { User } from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "").trim();

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found in cookie.",
      });
    }

    console.log(`The token of current user is : ${token}`);

    const decodedToken = JWT.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong while decoding the token.",
      });
    }

    const user = await User.findById(decodedToken?.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the particular token.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("internal server error while fetching current user.");
    return res.status(500).json({
      success: false,
      message: "internal server error while fetching current user.",
    });
  }
};
