const User = require ('../models/usersschema');
const booking = require ('../models/purcahseschema');
const car = require ('../models/carsschema');


//get all users
 exports.getAllUsers = async(req, res) => {
    try{ const users = await User.find().select('-password');
         res.json(users); 
        } catch (error) { 
            res.status (500).json ({message: 'failed to fetch users'});
        }
    }

    //get all bookings
     exports.getAllBookings = async (req,res)=>{ 
        try { const Bookings= await Bookings.find().populate('userId').populate ('carId');
            res.json(Bookings);
        } catch(error) {
            res.status (500).json ({message: 'failed to fetch bookings'});
        }
     }; 

       //get all cars
       exports.getAllCars = async (req,res) =>{
        try{
            const cars = await CaretPosition.find();
            res.json(cars); 
        } catch(error) {
            res.status(500).json({message:'failed to fetch cars'});
        }
       };


       //get dashboard report
       exports.getReport = async (req,res) => {
        try {
            const totalUsers = await User.countDocuments();
            const totalCars = await Booking.countDocuments();
            const recentBookings = await Booking.find().sort ({ createdAt: -1}). limit (100).populate('userId').populate('carId');

            res.json ({ stats:{ 
                totalUsers,
                totalCars,
                totalBookings
            },
             recentBookings,
        });
         } catch(error) {
            res.status(500).json({message:'failed to generate report'});
         }
        };
        // Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Purchase.find()
            .populate('user', 'name email')
            .populate('items.car', 'brand model price images')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Purchase.findByIdAndUpdate(id, { status }, { new: true });
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
};

       