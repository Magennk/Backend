const chatModel = require('../models/chatModel'); // Import the model

/**
 * Controller to create a chat between two users.
 * Checks if the chat exists; if not, creates it.
 */
exports.createChat = async (req, res) => {
  try {
    const { ownerEmail1, ownerEmail2 } = req.body;

    // Validate input
    if (!ownerEmail1 || !ownerEmail2) {
      return res
        .status(400)
        .json({ message: 'Both ownerEmail1 and ownerEmail2 are required.' });
    }

    // Delegate to the model to handle chat creation
    const chat = await chatModel.createOrGetChat(ownerEmail1, ownerEmail2);

    // Respond with the created or existing chat
    res
      .status(201)
      .json({ message: 'Chat successfully created or already exists.', chat });
  } catch (error) {
    console.error('Error in createChat:', error.message);
    res.status(500).json({
      message: 'Server error while creating chat.',
      error: error.message,
    });
  }
};

/**
 * Controller to send a message in a chat.
 * Inserts a message into the database.
 */
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderEmail, receiverEmail, messageText } = req.body;

    // Validate input
    if (!chatId || !senderEmail || !receiverEmail || !messageText) {
      console.error('Missing fields in request:', {
        chatId,
        senderEmail,
        receiverEmail,
        messageText,
      });
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Delegate to the model to send a message
    const message = await chatModel.sendMessage(
      chatId,
      senderEmail,
      receiverEmail,
      messageText
    );

    // Respond with the created message
    res.status(201).json({ message: 'Message sent successfully.', message });
  } catch (error) {
    console.error('Error in sendMessage:', error.message);
    res.status(500).json({
      message: 'Server error while sending message.',
      error: error.message,
    });
  }
};

/**
 * Controller to get all messages in a specific chat.
 * Fetches messages by chat ID.
 */
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Validate input
    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required.' });
    }

    // Delegate to the model to fetch messages
    const messages = await chatModel.getMessagesByChatId(chatId);

    // Respond with the fetched messages
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error in getMessages:', error.message);
    res.status(500).json({
      message: 'Server error while fetching messages.',
      error: error.message,
    });
  }
};

/**
 * Controller to get all chat users for the logged-in user.
 * Fetches users the logged-in user has chats with.
 */
exports.getChatUsers = async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }
    const users = await chatModel.getChatUsers(userEmail);
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error in getChatUsers:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
