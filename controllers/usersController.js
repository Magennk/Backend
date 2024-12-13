const usersModel = require("../models/usersModel"); // Import the users model

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
  