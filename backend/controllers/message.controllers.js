import uploadOnCloude from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;
    let { message } = req.body;

    if (!sender || !receiver) {
      return res.status(400).json({
        status: false,
        message: "Missing sender or receiver",
      });
    }

    if (!message && !req.file) {
      return res.status(400).json({
        status: false,
        message: "Message or image is required",
      });
    }

    const newMessage = new Message({
      message,
      sender,
      receiver,
    });

    if (req.file) {
      let imagePath = req.file.path;
      let imgUrl = await uploadOnCloude(imagePath);
      if (!imgUrl) {
        return res.status(400).json({
          status: false,
          message: "Image sending failed",
        });
      }
      newMessage.image = imgUrl;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    const savedMessage = await newMessage.save();

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [savedMessage._id],
        lastMessage: savedMessage._id,
      });
    } else {
      conversation.messages.push(savedMessage._id);
      conversation.lastMessage = savedMessage._id;
      await conversation.save();
    }

    const receiverSocketId = getReceiverSocketId(receiver);
    const senderSocketId = getReceiverSocketId(sender);

    if (receiverSocketId) {
      const unreadCount = await Message.countDocuments({
        sender,
        receiver,
        isRead: false,
      });
      io.to(receiverSocketId).emit("newMessage", savedMessage);
      io.to(receiverSocketId).emit("conversationUpdated", {
        userId: sender,
        lastMessage: savedMessage,
        lastMessageAt: savedMessage.createdAt,
        unreadCount,
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("conversationUpdated", {
        userId: receiver,
        lastMessage: savedMessage,
        lastMessageAt: savedMessage.createdAt,
      });
    }

    return res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Send message Error: ${error.message}`,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;

    if (!sender || !receiver) {
      return res.status(400).json({
        status: false,
        message: "Missing sender or receiver",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    const unreadResult = await Message.updateMany(
      {
        sender: receiver,
        receiver: sender,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    if (unreadResult.modifiedCount > 0) {
      const partnerSocketId = getReceiverSocketId(receiver);
      if (partnerSocketId) {
        io.to(partnerSocketId).emit("messagesRead", {
          userId: sender,
          receiver,
          unreadCount: 0,
        });
      }
    }

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Chat Error: ${error.message}`,
    });
  }
};
