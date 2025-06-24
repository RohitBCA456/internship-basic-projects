import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: mongoose.Types.ObjectId,
      ref: 'Token'
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model('Patient', patientSchema)