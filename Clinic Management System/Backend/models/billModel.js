import mongoose, { Schema } from "mongoose";

const billSchema = new Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    amount: Number,
    services: [String],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);
