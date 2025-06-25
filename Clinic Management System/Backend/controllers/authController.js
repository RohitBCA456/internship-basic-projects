import { User } from "../models/userModel.js";

const register = async (req, res) => {
  try {
    let { username, password, role } = req.body;

    console.log("Register data:", req.body);

    username = username.trim().toLowerCase();
    role = role.trim().toLowerCase();

    if ([username, password, role].some((field) => field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const userAlreadyExist = await User.findOne({ username });

    if (userAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this username.",
      });
    }

    const user = await User.create({ username, password, role });

    const responseUser = {
      _id: user._id,
      username: user.username,
      role: user.role,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: responseUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while registering the user.",
    });
  }
};

const login = async (req, res) => {
  try {
    let { username, password } = req.body;

    console.log("Login data:", req.body);

    username = username.trim().toLowerCase();

    if ([username, password].some((field) => field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = user.generateAccessToken();

    user.accessToken = token;
    user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    };

    return res.status(200).cookie("accessToken", token, options).json({
      success: true,
      message: "User logged in successfully.",
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while logging in the user.",
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    await User.findByIdAndUpdate(userId, { $unset: { accessToken: "" } });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while logging out the user.",
    });
  }
};

export { register, login, logout };
