// controllers/contactController.js
const ContactMessage = require('../models/contactSchema'); 
const validation = require('../utils/validation'); // Import the unified validation utility

exports.submitContactForm = async (req, res) => {
    // Destructure all expected fields from the request body
    const { name, email, phone, address, message } = req.body;

    // --- Backend Validation using functions from the 'validation' object ---
    if (validation.isEmpty(name)) {
        return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (validation.isEmpty(email)) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!validation.isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }
    // Phone is optional, but validate if provided and not empty
    if (!validation.isEmpty(phone) && !validation.isValidPhoneNumber(phone)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
    }
    // Address is optional, but validate if provided and not empty, and meets length
    if (!validation.isEmpty(address) && !validation.isLength(address, 5)) { // Assuming min length 5 for address
        return res.status(400).json({ success: false, message: 'Address should be at least 5 characters long.' });
    }
    if (validation.isEmpty(message)) {
        return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }
    if (!validation.isLength(message, 10)) { // Assuming min length 10 for message
        return res.status(400).json({ success: false, message: 'Message must be at least 10 characters long.' });
    }
    // --- End Backend Validation ---

    try {
        // Create and save the contact message to the database
        const newContact = await ContactMessage.create({
            name,
            email,
            // If phone/address are optional, store `undefined` if empty strings
            // Mongoose will then not save the field, or use default if defined in schema.
            phone: validation.isEmpty(phone) ? undefined : phone,
            address: validation.isEmpty(address) ? undefined : address,
            message
        });

        console.log('Contact message saved to DB:', newContact); // For your server logs

        // Send a success response back to the frontend
        res.status(201).json({ // Use 201 Created for successful resource creation
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.',
            data: newContact // Optionally send the saved data back
        });

    } catch (error) {
        // Handle Mongoose validation errors (from schema definitions) or other database errors
        console.error('Error submitting contact form:', error);

        let errorMessage = 'Server error. Failed to send message.';
        // If it's a Mongoose validation error (e.g., email format not matching schema regex)
        if (error.name === 'ValidationError') {
            // Extract messages from schema validation errors
            errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({ success: false, message: errorMessage });
        }

        // Generic server error
        res.status(500).json({ success: false, message: errorMessage });
    }
};