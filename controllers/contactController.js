const ContactMessage = require('../models/contactSchema');
const validation = require('../utils/validation');

exports.submitContactForm = async (req, res) => {
    const { name, email, phone, address, message } = req.body;

 
    if (validation.isEmpty(name)) {
        return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
    }
    if (validation.isEmpty(email)) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    if (!validation.isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!validation.isEmpty(phone) && !validation.isValidPhoneNumber(phone)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
    }
  
    if (!validation.isEmpty(address) && !validation.isLength(address, 5)) {
        return res.status(400).json({ success: false, message: 'Address should be at least 5 characters long.' });
    }
    if (validation.isEmpty(message)) {
        return res.status(400).json({ success: false, message: 'Message is required.' });
    }
    if (!validation.isLength(message, 10)) { 
        return res.status(400).json({ success: false, message: 'Message must be at least 10 characters long.' });
    }

    try {
        const newContactMessage = new ContactMessage({
            name,
            email,
            phone: phone || undefined, 
            address: address || undefined, 
            message
        });

        await newContactMessage.save(); 

        console.log('Backend: Contact message successfully saved to database.');
        return res.status(201).json({ success: true, message: 'Your message has been sent successfully!' });

    } catch (error) {
        console.error('Backend: Error saving contact message to database:', error); 
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ success: false, message: 'Validation failed', errors: errors });
        }

        /
        return res.status(500).json({ success: false, message: 'Internal server error. Could not send message at this time.' });
    }
};