import express from "express";
import {
  generateBill,
  getBillsByPatient,
} from "../controllers/billingController.js";

const router = express.Router();

router.post("/billing", generateBill);
router.get("/billing/:patientId", getBillsByPatient);

export default router;
