import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
          studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
          },
          teacherId: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
          },
          date: {
            type: Date,
            required: true,
          },
          timeSlot: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
          },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);