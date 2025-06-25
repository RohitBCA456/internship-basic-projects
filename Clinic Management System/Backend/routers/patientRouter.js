import { Router } from "express";
import { registerPatient, getAllPatientsByPrescription, seePatientsHistory } from "../controllers/patientController.js";

const router = Router();

router.route("/registerPatient").post(registerPatient);
router.route("/getPatientHistory").get(seePatientsHistory);
router.route("/getPatientsByPrescription").get(getAllPatientsByPrescription);

export default router;
