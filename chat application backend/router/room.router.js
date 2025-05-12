import Router from "express";
import {
  deleteRoom,
  getAllRooms,
  leaveRoom,
} from "../controller/room.controller.js";

const router = Router();

router.route("/deleteroom").post(deleteRoom);
router.route("/getallroom").get(getAllRooms);
router.route("/leaveroom").post(leaveRoom);

export default router;
