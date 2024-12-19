const chatModel = require('../models/chatModel');

// Initialize a chat and fetch chat history
exports.initChat = async (req, res) => {
  try {
    const { ownerEmail1, ownerEmail2 } = req.body;

    if (!ownerEmail1 || !ownerEmail2) {
      return res.status(400).json({ message: "Both user emails are required." });
    }

    // Check if chat exists
    let chat = await chatModel.checkChatExists(ownerEmail1, ownerEmail2);
    if (!chat) {
      chat = await chatModel.createChat(ownerEmail1, ownerEmail2); // Create a new chat if it doesn't exist
    }

    // Fetch chat history
    const chatHistory = await chatModel.getChatHistory(ownerEmail1, ownerEmail2);

    res.status(200).json({ chat, chatHistory });
  } catch (error) {
    console.error("Error initializing chat:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { senderEmail, receiverEmail, messageText } = req.body;

    if (!senderEmail || !receiverEmail || !messageText) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Save the message to the database
    const newMessage = await chatModel.saveMessage(senderEmail, receiverEmail, messageText);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
