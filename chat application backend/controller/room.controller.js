import { Room } from "../model/room.model.js";
import { User } from "../model/user.model.js";
const deleteRoom = async (req, res) => {
  try {
    const { roomId, username } = req.body; // Get the room ID from the request body
    console.log(roomId, username);
    // Find the room and delete it
    const room = await Room.findOneAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    const user = await User.findOneAndDelete(username);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Room deleted but not the username." });
    }

    return res.status(200).json({ message: "Room deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Error while deleting the room." });
  }
};

const leaveRoom = async(req, res) => {
  try {
    const username = req.body;
    console.log(username);
    const user = await User.findOneAndDelete(username);
    if(!user) {
      return res.status(404).json({message: "User not found."})
    }
    return res.statsu(200).json({message: "User left the room successfully."})
  } catch (error) {
    return res.status(500).json({message: "Error while leaving the room."})
  }
}

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find(); // Fetch all rooms from the database
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(500).json({ message: "Error while fetching rooms." });
  }
};

export { deleteRoom, getAllRooms, leaveRoom };
