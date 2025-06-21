import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { seeAppointments, sendAppointment } from "../controllers/appointmentController.js";

const router = Router();

router.route("/sendAppointment").post(verifyJWT, sendAppointment);
router.route("/seeAppointments").get(verifyJWT, seeAppointments);

export default router;
