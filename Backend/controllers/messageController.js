const Message = require("../models/Message.js"); // DB model

// Get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a message as read
const markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message marked as read", data: updatedMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllMessages,
  markMessageAsRead, // 👈 Don't forget to export it!
};
