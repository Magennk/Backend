const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to initialize a chat and fetch history
router.post('/init', chatController.initChat);

// Route to send a new message
router.post('/send', chatController.sendMessage);

module.exports = router;
