import Router from "express";
import { deleteRoom } from "../controller/room.controller.js";

const router = Router();

router.route("/deleteroom").post(deleteRoom)

export default router