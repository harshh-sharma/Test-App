
const express = require("express");
const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Create a chat with the logged-in user and another member

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.body;
    const userId = req.user.userId;

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        message: "Valid memberId is required",
      });
    }

    if (userId === memberId) {
      return res.status(400).json({
        message: "Choose another user",
      });
    }

    const memberExists = await User.exists({ _id: memberId });

    if (!memberExists) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const chat = await Chat.create({
      members: [userId, memberId],
    });

    return res.status(201).json({
      message: "Chat created",
      chat,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


module.exports = router;
