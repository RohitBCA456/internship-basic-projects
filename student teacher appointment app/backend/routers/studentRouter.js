import { Router } from "express";
import {
  loginStudent,
  registerStudent,
  searchTeacher,
} from "../controllers/studentController.js";

const router = Router();

router.route("/registerStudent").post(registerStudent);
router.route("/loginStudent").post(loginStudent);
router.route("/searchTeacher").post(searchTeacher);

export default router;
