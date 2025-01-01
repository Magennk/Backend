const multer = require('multer');
const imageModel = require('../models/imageModel');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'ownerImage') {
      uploadPath = imageModel
        .getOwnerImagePath('temp')
        .replace('temp.jpeg', '');
    } else if (file.fieldname === 'dogImage') {
      uploadPath = imageModel.getDogImagePath('temp').replace('temp.jpeg', '');
    }
    cb(null, uploadPath);
  },
});

// Multer Upload Handler
const upload = multer({ storage });

// Controller to handle owner image upload
exports.uploadOwnerImage = (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const filePath = imageModel.getOwnerImagePath(email);
  const tempPath = req.file.path;

  fs.rename(tempPath, filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to save owner image.' });
    }
    res.status(200).json({ imagePath: `/data/owners/${email}.jpeg` });
  });
};

// Controller to handle dog image upload
exports.uploadDogImage = (req, res) => {
  const dogId = req.body.dogId;
  if (!dogId) {
    return res.status(400).json({ message: 'Dog ID is required.' });
  }

  const filePath = imageModel.getDogImagePath(dogId);
  const tempPath = req.file.path;

  fs.rename(tempPath, filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to save dog image.' });
    }
    res.status(200).json({ imagePath: `/data/images/${dogId}.jpeg` });
  });
};

// Multer Middleware for Upload
exports.upload = upload.fields([
  { name: 'ownerImage', maxCount: 1 },
  { name: 'dogImage', maxCount: 1 },
]);
