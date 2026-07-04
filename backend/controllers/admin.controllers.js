import mongoose from "mongoose";
import User from "../models/user.model.js";
import uploadOnCloude from "../config/cloudinary.js";

export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ status: true, users });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: `Admin Get Users Error: ${error.message}`,
      });
  }
};

export const updateUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user id" });
    }

    const updateData = {};
    const { name, username, email, role } = req.body;
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    if (req.file) {
      const imagePath = req.file.path;
      const imgUrl = await uploadOnCloude(imagePath);
      if (!imgUrl) {
        return res
          .status(400)
          .json({ status: false, message: "Image upload failed" });
      }
      updateData.image = imgUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "User updated", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Admin Update Error: ${error.message}` });
  }
};

export const deleteUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user id" });
    }

    const deletedUser = await User.findByIdAndDelete(id).select("-password");
    if (!deletedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "User deleted", user: deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Admin Delete Error: ${error.message}` });
  }
};
