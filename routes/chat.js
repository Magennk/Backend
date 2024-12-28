const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to get users chats
router.get('/chat-users', chatController.getChatUsers);
// Route to get messages by chatId
router.get('/messages/:chatId', chatController.getMessages);

// Route to create a new chat
router.post('/create', chatController.createChat);

// Route to send a message
router.post('/send-message', chatController.sendMessage);

module.exports = router;
