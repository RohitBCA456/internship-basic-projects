import { Router } from "express";
import { registerPatient, getAllPatients } from "../controllers/patientController.js";

const router = Router();

router.route("/registerPatient").post(registerPatient);
router.route("/getAllPatients").get(getAllPatients);

export default router;
