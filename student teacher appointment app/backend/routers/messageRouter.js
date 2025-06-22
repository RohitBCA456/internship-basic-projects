import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getStudentMessages } from "../controllers/messageController.js";

const router = Router();

router.route("/getStudentMessages").get(verifyJWT, getStudentMessages);

export default router;