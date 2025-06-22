import mongoose from "mongoose"; // ✅ Required to convert string to ObjectId
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";

const getStudentMessages = async (req, res) => {
  try {
    const teacherId = req.user._id;
    console.log("Fetching messages for teacher ID:", teacherId);

    const messages = await Message.find({
      roomId: { $regex: teacherId.toString() },
    });

    console.log("Messages found:", messages);

    const studentIdStrings = [
      ...new Set(
        messages
          .map((msg) => msg.roomId.split("-"))
          .flat()
          .filter((id) => id !== teacherId.toString())
      ),
    ];

    console.log("Extracted studentId strings:", studentIdStrings);

    // ✅ Convert to ObjectId
    const studentObjectIds = studentIdStrings.map((id) =>
      new mongoose.Types.ObjectId(id)
    );

    const students = await User.find({
      _id: { $in: studentObjectIds },
      role: "student",
    }).select("name email");

    console.log("Students found:", students);

    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching chat students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

export { getStudentMessages };
