import uploadOnCloude from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

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

    let msg = await newMessage.save();

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [msg._id],
      });
    } else {
      conversation.messages.push(msg._id);
      await conversation.save();
    }

    return res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: msg,
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

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    return res.status(200).json(conversation.messages || []);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Chat Error: ${error.message}`,
    });
  }
};
