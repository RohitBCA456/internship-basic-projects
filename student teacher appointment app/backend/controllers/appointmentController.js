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

const seeAppointments = async (req, res) => {
  const userId = req.user?._id;
  const role = req.user?.role;

  try {
    let appointments;

    if (role === "student") {
      // Show appointments requested by this student
      appointments = await Appointment.find({ studentId: userId })
        .populate("teacherId", "name email department")
        .populate("studentId", "name email");
    } else if (role === "teacher") {
      // Show all appointments requested to this teacher (pending + confirmed + rejected)
      appointments = await Appointment.find({ teacherId: userId })
        .populate("teacherId", "name email department")
        .populate("studentId", "name email");
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching appointments",
      error: error.message,
    });
  }
};


const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  try {
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting appointment",
      error: error.message,
    });
  }
};

export { sendAppointment, seeAppointments, deleteAppointment };
