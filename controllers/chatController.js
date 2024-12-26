// chatController.js

const chatsModel = require('../models/chatModel');

// get the logged in user chats users interact with
exports.getChatUsers = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const chatUsers = await chatsModel.getChatUsers(email);

    res.status(200).json(chatUsers);
  } catch (error) {
    console.error('Error fetching chat users:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
