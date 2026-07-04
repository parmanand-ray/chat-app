import mongoose from "mongoose";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
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
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    res.status(200).json({
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

export const getAllUser = async (req, res) => {
  try {
    const userId = req.userId;

    const allUser = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          receiver: new mongoose.Types.ObjectId(userId),
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 },
        },
      },
    ]);

    const unreadMap = new Map(
      unreadCounts.map((item) => [item._id.toString(), item.count]),
    );

    const conversationMap = new Map();
    conversations.forEach((conversation) => {
      const otherUserId = conversation.participants.find(
        (id) => id.toString() !== userId.toString(),
      );
      if (otherUserId) {
        conversationMap.set(otherUserId.toString(), {
          lastMessage: conversation.lastMessage,
          lastMessageAt:
            conversation.lastMessage?.createdAt || conversation.updatedAt,
          unreadCount: unreadMap.get(otherUserId.toString()) || 0,
        });
      }
    });

    const usersWithLastMessage = allUser
      .map((user) => {
        const chatData = conversationMap.get(user._id.toString());
        return {
          ...user.toObject(),
          lastMessage: chatData?.lastMessage || null,
          lastMessageAt: chatData?.lastMessageAt || null,
          unreadCount: chatData?.unreadCount || 0,
        };
      })
      .sort((a, b) => {
        return new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0);
      });

    res.status(200).json({ status: true, user: usersWithLastMessage });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `All User Error ${error.message}` });
  }
};
