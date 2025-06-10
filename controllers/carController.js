//to import db and interact with it like find ,delate save 
const Car=require('../models/carsschema');
// get all the cars with any filters 
exports.getAllCars=async(req,res)=>{
    const filters=req.query;
    const cars=await Car.find(filters);
   // send the result back 
    res.json(cars);
    //get/cars?brand=porche
};
  exports.getCarById=async(req,res)=>{
    // find th specfic car in mongoodb
    const car=await Car.findById(req.params.id);//takes the id by url 
    res.json(car);
  };
  exports.updateCar=async(req,res)=>{
const updateCar=await Car.findByIdAndUpdate(req.params.id,req.body,{ new:true});// {new:true tells monogoose the updated data , body feyha updated data }
res.json(updateCar);
  }
  exports.deleteCar=async(req,res)=>{
    await Car.findByIdAndDelete(req.params.id);
    res.json({message:'car deleted'});
  }
  const renderUpdateCarForm = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).render('error', { message: 'Car not found.' }); // Render an error page or redirect
        }

        res.render('updatecar', { car });
    } catch (error) {
        console.error('Error rendering update car form:', error);
        res.status(500).render('error', { message: 'Server error while loading update form.' }); // Render an error page or redirect
    }
};


module.exports = {
    renderUpdateCarForm,
};