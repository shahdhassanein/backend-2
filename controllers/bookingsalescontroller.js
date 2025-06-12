const Purchase = require('../models/purchaseschema');
const Car = require('../models/carsschema');
const User = require('../models/usersschema');

// to create a new purchase
exports.purchaseCar = async (req, res) => {
    try {
        const userId = req.user._id;  
        const { carId, paymentInfo } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const car = await Car.findById(carId);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        if (!car.availability) {
            return res.status(400).json({ message: 'Car is not available for purchase' });
        }

        const purchase = new Purchase({
            userId,
            carId,
            paymentInfo
        });

        car.availability = false;
        await car.save();
        await purchase.save();

        res.status(201).json({ message: 'Purchase completed successfully', purchase });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ message: 'Failed to complete purchase', error: error.message });
    }
};

// Get purchases for the logged-in user (API endpoint, generally not used for EJS rendering)
exports.getMyPurchases = async (req, res) => {
    try {
        const userId = req.user._id; 
        console.log('*** API endpoint: /my-purchases called for userId (should not be used for EJS):', userId); // Log for API call
        const purchases = await Purchase.find({ userId })
            .populate('carId')
            .populate('userId', '-password');
        res.json(purchases);
        console.log('API endpoint: /my-purchases - Sent purchases:', purchases.length); // Log success
    } catch (error) {
        console.error('Get purchases error (API endpoint):', error);
        res.status(500).json({ message: 'Failed to fetch purchases' });
    }
};

// This function is specifically called by the EJS rendering route for '/view-my-purchases'
exports.getMyPurchasesData = async (userId) => {
    console.log('*** Inside getMyPurchasesData function (for EJS rendering) ***');
    console.log('getMyPurchasesData received userId:', userId); // Log the ID received that was passed from the route

    try {
        // Step 1: Fetch raw purchases for the userId to confirm existence before population
        // This log helps confirm if any documents are found for the userId before population.
        const rawPurchases = await Purchase.find({ userId: userId });
        console.log('getMyPurchasesData - Raw purchases found (before populate):', rawPurchases);
        console.log('getMyPurchasesData - Number of raw purchases:', rawPurchases.length);

        // Step 2: Fetch and populate purchases for EJS rendering
        const populatedPurchases = await Purchase.find({ userId: userId })
            .populate('carId')     // Ensure 'carId' is the correct field name in your Purchase schema
            .populate('userId', '-password') // Ensure 'userId' is the correct field name and matches User model
            .lean(); // Use .lean() for faster rendering with EJS as it returns plain JS objects

        console.log('getMyPurchasesData - Populated purchases found:', populatedPurchases);
        console.log('getMyPurchasesData - Number of populated purchases:', populatedPurchases.length);
        console.log('*** Exiting getMyPurchasesData function ***');

        return populatedPurchases;
    } catch (error) {
        console.error('Error in getMyPurchasesData (for EJS rendering):', error);
        // Re-throw the error so the calling route can catch and handle the response.
        throw new Error('Failed to retrieve user purchases: ' + error.message);
    }
};

// Get all purchases (for admin or general view)
exports.getAllPurchases = async () => {
    try {
        console.log('Attempting to fetch all purchases from MongoDB (getAllPurchases)...');
        const purchases = await Purchase.find({}) // Find all purchases
            .populate('carId') // Populate car details
            .populate('userId', '-password'); // Populate user details (excluding password)
            
        console.log('Purchases fetched by controller (getAllPurchases):', purchases);
        console.log('Number of purchases fetched by getAllPurchases:', purchases.length);
        return purchases;
    } catch (error) {
        console.error('Error in getAllPurchases controller:', error);
        throw new Error('Failed to retrieve all purchases');
    }
};