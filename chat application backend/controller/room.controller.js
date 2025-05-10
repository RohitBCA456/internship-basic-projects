import { Room } from "../model/room.model.js";
const deleteRoom = async (req, res) => {
  try {
    const { roomId, username } = req.body; // Get the room ID from the request body
    console.log(roomId);
    // Find the room and delete it
    const room = await Room.findOneAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    return res.status(200).json({ message: "Room deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Error while deleting the room." });
  }
};

export { deleteRoom };
