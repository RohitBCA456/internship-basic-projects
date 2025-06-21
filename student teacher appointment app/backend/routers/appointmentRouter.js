import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { sendAppointment } from "../controllers/appointmentController.js";

const router = Router();

router.route("/sendAppointment").post(verifyJWT, sendAppointment);

export default router;
