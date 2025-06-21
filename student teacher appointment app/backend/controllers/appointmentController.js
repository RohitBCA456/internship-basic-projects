import { Appointment } from "../models/appointmentModel.js";
import { User } from "../models/userModel.js";

const sendAppointment = async (req, res) => {
  const { teacherId } = req.body;
  const studentId = req.user?._id;
  try {
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    const appointment = await Appointment.create({
      studentId,
      teacherId: teacher._id,
      status: "pending",
    });
    return res.status(201).json({
      success: true,
      message: "Appointment request sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while sending appointment request",
      error: error.message,
    });
  }
};

export { sendAppointment };
