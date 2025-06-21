import { Router } from "express";
import { CurrentUserRole } from "../controllers/authController.js";

const router = Router();

router.route("/getUserRole").post(CurrentUserRole);

export default router;
