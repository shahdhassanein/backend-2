// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactMessage=require ('../models/contactSchema');
const contactController = require('../controllers/contactController');


router.post('/', contactController.submitContactForm);

module.exports = router;