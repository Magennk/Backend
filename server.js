require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const meetingsRoutes = require('./routes/meetings'); // Import Meetings routes
const dogsRoutes = require('./routes/dogs'); // Import Dogs routes
const cityRoutes = require('./routes/city'); // Import City routes
const usersRoutes = require("./routes/users"); // Import Users routes
const friendsRoutes = require("./routes/friends"); // Import Friends routes


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/dogs', dogsRoutes); // Dogs API
app.use('/api/meetings', meetingsRoutes); //Meetings API
app.use('/api', cityRoutes);// City API
app.use("/api/users", usersRoutes); // Users API
app.use("/api/friends", friendsRoutes); // Friends API
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


const db = require('./db/db'); // Add this line to include the database module

// Test the database connection
db.query('SELECT 1 + 1 AS result')
  .then((res) => {
    console.log('Database connected successfully:', res.rows[0]);
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });


