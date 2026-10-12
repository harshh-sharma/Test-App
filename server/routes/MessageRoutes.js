
const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get message history for a chat
router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({
        message: "Invalid chat ID",
      });
    }

    const isMember = await Chat.exists({
      _id: chatId,
      members: req.user.userId,
    });

    if (!isMember) {
      return res.status(403).json({
        message: "You are not authorized to view this chat",
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 })
      .limit(100);

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
