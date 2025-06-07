const Purchase = require('../models/purchaseschema');
const Car = require('../models/car');
const User = require('../models/user');

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

// Get all purchases for the logged-in user
exports.getMyPurchases = async (req, res) => {
  try {
    const userId = req.user._id; 

    const purchases = await Purchase.find({ userId })
      .populate('carId')
      .populate('userId', '-password');

    res.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Failed to fetch purchases' });
  }
};
