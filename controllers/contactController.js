const ContactMesssage= require ('../models/contactSchema');
const validation= require ('../utils/validation');

exports.submitContactForm = async (req,res)=> {
    const {name, email,phone, address, message}=req.body;


    if (validation.isEmpty(name)){ return res.status (400).json ({success:false, message:'Name cannot be empty'});}
if (validation.isEmpty(email)){ return res.status (400).json ({success:false, message:'Email is required'});}
if (!validation.isValidEmail(email)){ return res.status (400).json ({success:false, message:'Email is required'});}
if (!validation.isEmpty(phone) && !validation.isValidPhoneNumber(phone)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });}
if (!validation.isEmpty(address)&&!validation.isLength(address, 5))
    { return res.status (400).json ({success:false, message:'Adress should be at least 5 characters long'});}
if (validation.isEmpty(message)){ return res.status (400).json ({success:false, message:'Message is required'});}
 if (!validation.isLength(message, 10)) { // Assuming min length 10 for message
        return res.status(400).json({ success: false, message: 'Message must be at least 10 characters long.' });
}
}