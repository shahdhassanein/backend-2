const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    phone: {
        type: String,
        trim: true,
    
    },
    address: {
        type: String,
        trim: true,
       
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
}, {
    timestamps: false 
});


const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;