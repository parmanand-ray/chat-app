import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "inValid user id" });
    }
    const currUser = await User.findById(userId).select("-password");
    if (!currUser) {
      return res.status(404).json({ status: false, message: "User Not Found" });
    }
    res.status(200).json({ status: true, user: currUser });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Curr User Error ${error.message}` });
  }
};
