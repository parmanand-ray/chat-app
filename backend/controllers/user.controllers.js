import mongoose from "mongoose";
import User from "../models/user.model.js";
import uploadOnCloude from "../config/cloudinary.js";

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

export const editProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    let { name } = req.body;
    let updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (req.file) {
      let imagePath = req.file.path;
      let imgUrl = await uploadOnCloude(imagePath);
      if (!imgUrl) {
        res.status(400).json({ status: false, message: "Image upload failed" });
      }
      updateData.image = imgUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res
      .status(200)
      .json({
        status: true,
        message: "Profile Updated Successfully",
        user: updatedUser,
      });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Update Error : ${error.message}` });
  }
};
