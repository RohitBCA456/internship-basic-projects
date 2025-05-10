import Router from "express";
import { deleteRoom, getAllRooms } from "../controller/room.controller.js";

const router = Router();

router.route("/deleteroom").post(deleteRoom);
router.route("/getallroom").get(getAllRooms);

export default router;
