import mongoose, { Schema } from "mongoose";

const prescriptionSchema = new Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    medicines: [String],
    notes: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
