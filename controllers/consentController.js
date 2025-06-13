const User = require('../models/usersschema'); // Import your User model

exports.acceptCookieConsent = async (req, res, next) => {
    try {
        // The 'protect' middleware would have already attached the user's data to req.user
        // We use req.user._id to find the specific user in the database
        const user = await User.findById(req.user._id);

        if (!user) {
            console.warn(`[Consent Controller] Attempt to accept consent for non-existent user ID: ${req.user._id}`);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Update the consentAccepted field to true
        user.consentAccepted = true;
        await user.save(); // Save the updated user document to MongoDB

        console.log(`[Consent Controller] User ${user.email} (ID: ${user._id}) accepted cookie consent.`);

        // Send a success response back to the frontend
        res.status(200).json({
            success: true,
            message: 'Cookie consent accepted successfully.'
        });

    } catch (error) {
        // Log any errors that occur during the process
        console.error('[Consent Controller] Error accepting cookie consent:', error);
        res.status(500).json({ success: false, message: 'Server error accepting consent.' });
    }
};