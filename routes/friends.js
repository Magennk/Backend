const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

// GET: Fetch all friends of the logged-in user
router.get('/my-friends', friendsController.getMyFriends);

// GET: Fetch pending friend requests
router.get('/my-friend-requests', friendsController.getMyFriendRequests);

// Check if two users are friends
router.get('/is-friend', friendsController.isFriend);

// POST: Send a new friend request
router.post('/send-request', friendsController.sendFriendRequest);

// PATCH: Accept a friend request
router.patch('/accept-request', friendsController.acceptFriendRequest);

// DELETE: Remove a friend or decline a request
router.delete('/remove', friendsController.removeFriend);

module.exports = router;
