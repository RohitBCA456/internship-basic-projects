import express from "express";
import {
  getPatientByToken,
  createPrescription,
  getPrescriptionsByPatient,
} from "../controllers/prescriptionController.js";

const router = express.Router();

// Doctor fetches patient by token
router.get("/patients/token/:tokenId", getPatientByToken);

// Doctor adds a prescription
router.post("/prescriptions", createPrescription);

// Get patient's prescription history
router.get("/prescriptions/:patientId", getPrescriptionsByPatient);

export default router;
