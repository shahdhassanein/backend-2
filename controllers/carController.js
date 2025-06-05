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
    const car=await car.findById(req.params.id);//takes the id by url 
    res.json(car);
  };
  exports.createCar=async(req,res)=>{
    let imageUrls=[];
    if (req.files&& req.files.length >0){
     imageUrls=req.files.map(file=>file.path);
    }
    const car=new Car({
        ...req.body,imageUrls:imageUrls
    })
    await car.save();
    res.json(car);
  }