const usersModel = require("../models/usersModel"); // Import the users model
const dogsModel = require('../models/dogsModel'); // Import the dogs model

// Handle login requests
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Get email and password from request body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await usersModel.validateUser(email, password); // Validate user credentials

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user details (excluding password)
    res.status(200).json({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Hnadle Owner's information update
exports.updateOwner = async (req, res) => {
    try {
      const { email } = req.body; // Extract email from the request body
      const updatedData = req.body; // Extract updated owner data
  
      if (!email) {
        return res.status(400).json({ message: "Owner email is required" });
      }
  
      const updatedOwner = await usersModel.updateOwner(email, updatedData); // Call model function
  
      if (!updatedOwner) {
        return res.status(404).json({ message: "Owner not found" });
      }
  
      res.status(200).json({ message: "Owner updated successfully", owner: updatedOwner });
    } catch (error) {
      console.error("Error updating owner:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  // call the checkEmailExists function that check if an email already exists in the database.
  exports.checkEmail = async (req, res) => {
    try {
      const { email } = req.query; // Extract email from query parameters
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      const emailExists = await usersModel.checkEmailExists(email); // Call model function
      if (emailExists) {
        return res.status(200).json({ exists: true, message: "Email is already registered" });
      } else {
        return res.status(200).json({ exists: false, message: "Email is available" });
      }
    } catch (error) {
      console.error("Error in checkEmail:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };


// Function to register an owner and their dog, and link them in the database
exports.registerOwnerAndDog = async (req, res) => {
  try {
    const { owner, dog } = req.body; // Extract account, owner, and dog data
    console.log(req.body);

    if (!dog || !owner) {
      return res.status(400).json({ message: "Owner and dog data are required" });
    }

    // Step 1: Register the owner
    const registeredOwner = await usersModel.registerOwner(owner);

    // Step 2: Register the dog
    const registeredDog = await dogsModel.registerDog(dog);

    // Step 3: Link the owner and dog
    await dogsModel.linkOwnerAndDog(registeredOwner.email, registeredDog.dogid);

    // Send a success response
    res.status(201).json({
      message: "Owner and dog registered successfully",
      owner: registeredOwner,
      dog: registeredDog,
    });
  } catch (error) {
    console.error("Error in registerOwnerAndDog:", error.message); // Log the error
    res.status(500).json({ message: "Server Error", error: error.message }); // Send error response
  }
};



  