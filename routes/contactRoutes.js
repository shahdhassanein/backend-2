// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactMessage=require ('../models/contactSchema');
const contactController = require('../controllers/contactController');
/*router.post('/',async (req,res)=>{
     const {name,email,phone, address, message} =req.body;

     if (!name||!email||!message){
        return res.status (400).json ({ message: 'Name, email, and message are required fields.' });
    }
    try { const newContactMessage = new ContactMessage({
            name,
            email,
            phone,
            address,
            message })

      await newContactMessage.save();
        console.log('Message saved to database:', newContactMessage); // This will appear in your server console

        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error saving contact message to database:', error);
        // More detailed error for debugging:
        let errorMessage = 'Server error: Failed to send message. Please try again.';
        if (error.name === 'ValidationError') {
            errorMessage = `Validation Error: ${error.message}`;
        }
        res.status(500).json({ success: false, message: errorMessage });
    }
});*/

router.post('/', contactController.submitContactForm);

module.exports = router;