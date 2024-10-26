const express = require('express');
const {
  postCrop,
  getCrops,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');
const upload = require('../utils/upload');
const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Only farmers can post crops
router.post('/', authenticate, authorizeRole('farmer'), upload.array('photos', 5), postCrop);

// Buyers and farmers can view crops
router.get('/', authenticate, authorizeRole('farmer', 'buyer'), getCrops);

// Only farmers or admins can update/delete crops
router.put('/:id', authenticate, authorizeRole('farmer', 'admin'), updateCrop);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteCrop);

module.exports = router;
