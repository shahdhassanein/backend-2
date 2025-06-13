// routes/userManagementRoutes.js
const express = require('express');
const {
    addUser,
    removeUser,
    // updateUser, // Removed
    listUsers
} = require('../controllers/authcontroller'); // Import new functions from authcontroller
const { protect, authorize } = require('../middleware/auth'); // Assuming protect and authorize middleware

const router = express.Router();

// All user management routes should typically be protected and require admin role
router.use(protect); // Ensure user is logged in (using JWT from cookies/headers)
router.use(authorize('admin')); // Ensure logged-in user has 'admin' role

// Routes for user management
router.post('/add', addUser);        // POST /api/users/add
router.delete('/remove/:id', removeUser); // DELETE /api/users/remove/:id
// router.put('/update/:id', updateUser);  // REMOVED: PUT /api/users/update/:id
router.get('/', listUsers);          // GET /api/users/

module.exports = router;
