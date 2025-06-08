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
        try { const Bookings= await Bookings.find().populate('user car');
            res.json(Bookings);
        } catch(error) {
            res.status (500).json ({message: 'failed to fetch bookings'});
        }
     }; 

     