const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController"); // Import the users controller

// Define login route
router.post("/login", usersController.loginUser);

module.exports = router;
