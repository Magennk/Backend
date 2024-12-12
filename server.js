require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const meetingsRoutes = require('./routes/meetings'); // Import meetings route
const dogsRoutes = require('./routes/dogs'); // Dogs route
const cityRoutes = require('./routes/city'); // City route

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/dogs', dogsRoutes); // Dogs API
app.use('/api/meetings', meetingsRoutes); //Meetings API
app.use('/api', cityRoutes);// City API
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


