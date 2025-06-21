import { User } from "../models/userModel.js";

const CurrentUserRole = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "No user found with this email.",
    });
  }
  const role = user.role;
  return res.status(200).json({
    success: true,
    message: "Fetched role of current user.",
    role,
  });
};

export { CurrentUserRole };
