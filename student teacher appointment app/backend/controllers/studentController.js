import { User } from "../models/userModel.js";

const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if ([name, email, password].some((field) => field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    const student = await User.create({
      name,
      email,
      password,
      role: "student",
    });
    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while registering student",
      error: error.message,
    });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((field) => field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const student = await User.findOne({ email, role: "student" });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    const accessToken = student.generateAccessToken();
    student.accessToken = accessToken;
    await student.save({ validateBeforeSave: false });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while logging in",
      error: error.message,
    });
  }
};

const searchTeacher = async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject || subject.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }
    const teachers = await User.find({
      role: "teacher",
      subjects: { $in: [subject] },
    }).select("-password -accessToken");
    if (teachers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No teachers found for the specified subject",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Teachers found",
      data: teachers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while searching for teachers",
      error: error.message,
    });
  }
};

export { registerStudent, loginStudent, searchTeacher };
