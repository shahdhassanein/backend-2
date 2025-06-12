const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/adminOnly');
const adminController = require('../controllers/adminController');

// Method 1: Using middleware in route definition
router.get('/', protect, admin, adminController.getAdminDashboard);
router.get('/api/users', protect, admin, adminController.getAllUsers);