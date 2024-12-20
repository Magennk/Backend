const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController"); // Import the users controller

// Define get routes
router.get("/check-email", usersController.checkEmail); // Check if email of user already exist in DB

// Define login route
router.post("/login", usersController.loginUser); // Login function of user
router.post("/register-owner-dog", usersController.registerOwnerAndDog); // Route to register an owner and their dog

// Define update route
router.patch("/update-owner", usersController.updateOwner); // Update owner's information

module.exports = router;
