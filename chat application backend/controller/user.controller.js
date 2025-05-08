import { User } from "../model/user.model.js";
const registerUser = async (req, res) => {
  try {
    const { username } = req.body;
    if ([username].some((fields) => fields.trim() === "")) {
      return res.status(404).json({ messge: "Missing credentials" });
    }
    const user = await User.findOne({ username: username });
    if (user) {
      return res
        .status(404)
        .json({ message: "user already exists with this username" });
    }
    const user_data = new User({
      username: username,
    });

    const token = await user_data.generateToken(user_data._id);
    user_data.token = token;
    user_data.save({ validateBeforeSave: false });
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };
    return res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "user enter thr app in successfully." });
  } catch (error) {
    console.log("Error occured while registering user.", error);
    return res.status(500).json({ message: "user registration failed." });
  }
};



export { registerUser };
