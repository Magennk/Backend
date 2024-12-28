const friendsModel = require('../models/friendsModel');

// Controller to fetch all friends
exports.getMyFriends = async (req, res) => {
  try {
    const { email } = req.query; // Extract user email from query
    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const friends = await friendsModel.getFriends(email);
    res.status(200).json(friends); // Return list of friends
  } catch (error) {
    console.error('Error fetching friends:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to fetch friend requests
exports.getMyFriendRequests = async (req, res) => {
  try {
    const { email } = req.query; // Extract user email from query
    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const requests = await friendsModel.getFriendRequests(email); // Call updated model
    res.status(200).json(requests); // Return list of pending requests
  } catch (error) {
    console.error('Error fetching friend requests:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Controller to send a friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { senderEmail, recipientEmail } = req.body;
    if (!senderEmail || !recipientEmail) {
      return res
        .status(400)
        .json({ message: 'Both sender and recipient emails are required' });
    }

    const result = await friendsModel.sendFriendRequest(
      senderEmail,
      recipientEmail
    );
    if (!result) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { senderEmail, recipientEmail } = req.body;
    if (!senderEmail || !recipientEmail) {
      return res
        .status(400)
        .json({ message: 'Both sender and recipient emails are required' });
    }

    const result = await friendsModel.acceptFriendRequest(
      senderEmail,
      recipientEmail
    );
    if (!result) {
      return res
        .status(400)
        .json({ message: 'Failed to accept friend request' });
    }

    res.status(200).json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error('Error accepting friend request:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to remove a friend or decline a request
exports.removeFriend = async (req, res) => {
  try {
    const { email1, email2 } = req.body;
    if (!email1 || !email2) {
      return res.status(400).json({ message: 'Both user emails are required' });
    }

    const result = await friendsModel.removeFriend(email1, email2);
    if (!result) {
      return res
        .status(400)
        .json({ message: 'Failed to remove friend or decline request' });
    }

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Check if the logged in user and the given user are friends or not
exports.isFriend = async (req, res) => {
  try {
    const { email1, email2 } = req.query; // Extract the two emails from query params
    if (!email1 || !email2) {
      return res.status(400).json({ message: 'Both emails are required' });
    }

    const isFriend = await friendsModel.checkIfFriends(email1, email2);
    res.status(200).json({ isFriend });
  } catch (error) {
    console.error('Error checking friendship status:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
