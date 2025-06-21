import Router from "express";
import {
  loginAdmin,
  addStudent,
  addTeacher,
  deleteStudent,
  deleteTeacher,
  getAllStudents,
  getAllTeachers,
} from "../controllers/adminController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/loginAdmin").post(loginAdmin);
router.route("/addTeacher").post(verifyJWT, addTeacher);
router.route("/addStudent").post(verifyJWT, addStudent);
router.route("/deleteStudent/:studentId").delete(verifyJWT, deleteStudent);
router.route("/deleteTeacher/:teacherId").delete(verifyJWT, deleteTeacher);
router.route("/getAllTeachers").get(verifyJWT, getAllTeachers);
router.route("/getAllStudents").get(verifyJWT, getAllStudents);


export default router;