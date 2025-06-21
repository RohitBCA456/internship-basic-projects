import { Appointment } from "../models/appointmentModel.js";
import { User } from "../models/userModel.js";

const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, department, subject } = req.body;
    if (
      [name, email, password, department, subject].some(
        (field) => field.trim() === ""
      )
    ) {
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
    const teacher = await User.create({
      name,
      email,
      password,
      department,
      subject,
      role: "teacher",
    });
    return res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while registering teacher",
      error: error.message,
    });
  }
};

const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((field) => field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const teacher = await User.findOne({ email, role: "teacher" });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    const isPasswordValid = await teacher.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    const accessToken = teacher.generateAccessToken();
    teacher.accessToken = accessToken;
    await teacher.save();
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
      message: "Internal server error while logging in teacher",
      error: error.message,
    });
  }
};

const appointmentController = async (req, res) => {
  try {
    const teacherId = req.user?._id;
    const { appoitmentStatus, studentId, date, time } = req.body;

    if (appoitmentStatus === false) {
      return res.status(400).json({
        success: false,
        message: "Appointment is cancelled by teacher.",
      });
    }

    const appointment = await Appointment.findOneAndUpdate(
      {
        teacherId: teacherId,
        studentId: studentId,
        status: "pending",
      },
      {
        status: appoitmentStatus ? "confirmed" : "cancelled",
        date: date,
        timeSlot: time,
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or already processed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment processed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while processing appointment",
      error: error.message,
    });
  }
};

export { registerTeacher, loginTeacher, appointmentController };
