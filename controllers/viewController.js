// controllers for bothterms and privacy brdo 

/**
 * @desc    Renders a static EJS page
 * @param   {string} viewName - The name of the EJS file (e.g., 'Term', 'Privacy')
 * @param   {string} pageTitle - The title for the page
 */
exports.renderStaticPage = (viewName, pageTitle) => (req, res) => {
    try {
        // Pass user object for conditional navbar rendering, and the title
        res.render(viewName, { 
            title: pageTitle,
            user: req.user || null // Ensure user is passed for navbar conditionals
        });
        console.log(`[View Controller] Rendering ${viewName}.ejs with title: ${pageTitle}`);
    } catch (error) {
        console.error(`[View Controller] Error rendering ${viewName}.ejs:`, error);
        res.status(500).send('Server error loading page.');
    }
};