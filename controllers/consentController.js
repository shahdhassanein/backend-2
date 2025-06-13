const User = require('../models/usersschema'); // Ensure this path is correct

/**
 * @desc    Record that a logged-in user has accepted cookie consent
 * @route   POST /api/consent/accept
 * @access  Private (requires authentication via 'protect' middleware)
 */
exports.acceptCookieConsent = async (req, res, next) => {
    // The 'protect' middleware ensures req.user is populated with the authenticated user
    if (!req.user) {
        console.warn('[Consent Controller] Attempt to accept cookie consent without an authenticated user. This should be caught by middleware.');
        return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            console.error(`[Consent Controller] User not found for ID: ${req.user._id} during consent update.`);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Only update if not already accepted to avoid unnecessary DB writes
        if (user.consentAccepted !== true) {
            user.consentAccepted = true;
            await user.save(); // Save the updated user document
            console.log(`[Consent Controller] User ${user.email} (ID: ${user._id}) accepted cookie consent. DB updated to true.`);
        } else {
            console.log(`[Consent Controller] User ${user.email} (ID: ${user._id}) already had consent accepted. No DB change needed.`);
        }

        res.status(200).json({
            success: true,
            message: 'Cookie consent recorded successfully.'
        });

    } catch (error) {
        console.error('[Consent Controller] Error in acceptCookieConsent:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while recording cookie consent.'
        });
    }
};

/**
 * @desc    Check if the logged-in user has accepted cookie consent
 * @route   GET /api/consent/status
 * @access  Private (requires authentication via 'protect' middleware)
 * Returns { hasAccepted: boolean }
 */
exports.checkCookieConsentStatus = async (req, res, next) => {
    // The 'protect' middleware ensures req.user is populated with the authenticated user
    // If req.user is null here, it means the user is not logged in.
    if (!req.user) {
        console.log('[Consent Controller] checkCookieConsentStatus: User not logged in. Banner should appear.');
        return res.status(200).json({ hasAccepted: false }); // If not logged in, assume consent is not given for this session
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            console.error(`[Consent Controller] User not found for ID: ${req.user._id} when checking consent status.`);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Return the current consent status from the database
        console.log(`[Consent Controller] checkCookieConsentStatus: User ${user.email} has consentAccepted: ${user.consentAccepted}`);
        res.status(200).json({
            hasAccepted: user.consentAccepted || false // Ensure it's always a boolean, default to false
        });

    } catch (error) {
        console.error('[Consent Controller] Error in checkCookieConsentStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking cookie consent status.'
        });
    }
};