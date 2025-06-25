import express from "express";
import {
  generateBill,
  getBillsByPatient,
  getPatientsWithPrescriptionNoBill,
} from "../controllers/billingController.js";

const router = express.Router();

router.post("/billing", generateBill);
router.get("/getPatientsWithoutBill", getPatientsWithPrescriptionNoBill);
router.get("/billing/:patientId", getBillsByPatient);

export default router;
