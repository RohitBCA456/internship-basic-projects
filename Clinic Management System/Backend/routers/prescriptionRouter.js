import express from "express";
import {
  getPatientByToken,
  createPrescription,
  getPrescriptionsByPatient,
} from "../controllers/prescriptionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Doctor fetches patient by token
router.get("/patients/token/:tokenId", getPatientByToken);

// Doctor adds a prescription
router.post("/createPrescriptions", authMiddleware, createPrescription);

// Get patient's prescription history
router.get("/prescriptions/:patientId", getPrescriptionsByPatient);

export default router;
