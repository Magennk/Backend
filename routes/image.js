const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');

const router = express.Router();

// Ensure the temporary directory exists
const tempUploadDir = path.join(__dirname, '../../temp/uploads');
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

// Storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../temp/uploads')); // Temporary upload location
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Temporary filename (renamed later)
  },
});

const upload = multer({ storage });

// Endpoint for uploading owner image
router.post('/upload-owner', upload.single('ownerImage'), (req, res) => {
  try {
    const email = req.body.email; // Extract email from request body
    if (!email || !req.file) {
      return res.status(400).json({ message: 'Email or file is missing' });
    }

    const fileName = `${email}.jpeg`; // Use email as filename
    const uploadDir = path.join(
      __dirname,
      '../../Frontend/barkbuddy-web/public/data/owners'
    );
    const filePath = path.join(uploadDir, fileName);

    // Move file to final destination
    fs.renameSync(req.file.path, filePath);

    res.status(200).json({ imagePath: `/data/owners/${fileName}` }); // Respond with relative path
  } catch (error) {
    console.error('Error uploading owner image:', error.message);
    res.status(500).json({ message: 'Failed to upload owner image' });
  }
});

// Endpoint for uploading dog image
router.post('/upload-dog', upload.single('dogImage'), (req, res) => {
  try {
    const ownerEmail = req.body.ownerEmail; // Use owner's email for file grouping
    if (!ownerEmail || !req.file) {
      return res
        .status(400)
        .json({ message: 'Owner email or file is missing' });
    }

    const dogId = req.body.ownerEmail || 'temp'; // Use dogId or a temp identifier
    const fileName = `${dogId}.jpeg`; // Name file as dogId.jpeg
    const uploadDir = path.join(
      __dirname,
      '../../Frontend/barkbuddy-web/public/data/images'
    );
    const filePath = path.join(uploadDir, fileName);

    // Move file to final destination
    fs.renameSync(req.file.path, filePath);

    res.status(200).json({ imagePath: `/data/images/${fileName}` }); // Respond with relative path
  } catch (error) {
    console.error('Error uploading dog image:', error.message);
    res.status(500).json({ message: 'Failed to upload dog image' });
  }
});

module.exports = router;
