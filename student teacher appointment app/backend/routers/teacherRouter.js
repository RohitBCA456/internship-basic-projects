import { Router } from "express";
import {
  appointmentController,
  loginTeacher,
  registerTeacher,
} from "../controllers/teacherController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/registerTeacher").post(registerTeacher);
router.route("/loginTeacher").post(loginTeacher);
router.route("/appointmentController").post(verifyJWT, appointmentController);

export default router;
