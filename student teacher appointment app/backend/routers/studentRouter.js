import { Router } from "express";
import { loginStudent, registerStudent } from "../controllers/studentController.js";

const router = Router();

router.route("/registerStudent").post(registerStudent);
router.route("/loginStudent").post(loginStudent);

export default router;