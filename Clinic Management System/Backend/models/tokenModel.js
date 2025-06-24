import mongoose, { Schema } from "mongoose";

const tokenShema = new Schema(
  {
    tokenNumber: String,
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Token = mongoose.model('Token', tokenShema);