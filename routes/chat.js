const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to get users chats
router.get('/chat-users', chatController.getChatUsers);

module.exports = router;
