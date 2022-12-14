const BookingModel = require("../../model/booking");
const FaviouritesModel=require("../../model/faviourites");
const camr = require("../../model/car");
const carModel = require("../../model/carModel");
const carBrandModel = require("../../model/carBrand");
const carPriceMOdel = require("../../model/carprice");
const carprice = require("../../model/carprice");
const paymentMOdel = require("../../model/payment");
var mongoose = require('mongoose');

exports.addFavourites = async function (req, res) {
  try {
    const {carId} =req.body;
  const count = await FaviouritesModel.find({carId:carId,customerId:req.userId}).countDocuments();
  if (count == 0) {
    const bookingObj = new FaviouritesModel({
        carId: carId,
        customerId: req.userId,
        date: new Date().toISOString().slice(0, 10)
      });
      bookingObj.save(function (er, data) {
        if (er) {
          res.status(400).json({
            success: false,
            message: "Not Added.Please try again",
            Error: er
          });
        }
        if (data) {
          res
            .status(200)
            .json({
              success: true,
              message: "Faviourites added successfully",
              data: data
            });
        }
      });
   
  } else {
    res.status(400).json({success: true, message: "Faviourite Already added"});
  }
}
catch{
    res.status(400).json({success: true, message: "Something Went wrong.Please try again"});
}
}

exports.getFavourites = async function (req, res) {
    try {
        console.log("hello123");
        let condition = {};

        if (req.body.carType && req.body.carType != "All") {
          condition.carType = req.body.carType;
        }

        let availableCarResult  = await carModel.aggregate([
            {
                "$match":condition
            },
            {
                $lookup:{
                    from: "carprices",       // other table name
                    localField: "_id",   // name of users table field
                    foreignField: "carId", // name of userinfo table field
                    as: "carsprices"         // alias for userinfo table
                }   
            }, 
            {   
              $project:{
                  _id : 1,
                  carType:1,
                  carImage:1,
                  carRegisterImage:1,
                  vehicleType:1,
                  carBrandId:1,
                  carBrandName:1,
                  carModelId:1,
                  carModelName:1,
                  carMakeYear:1,
                  carColorAvailble:1,
                  carFeatureId:1,
                  carFeatures:1,
                  carSpecId:1,
                  carSpecs:1,
                  carBootCapacity:1,
                  createdBy:1,
                  logDateCreated:1,
                  logDateModified:1,
                  isFeatured:1,
                  isFavorite: 1,
                  isActive: 1,
                  description:1,
                  avg_rating:1,           
                  carprice:"$carsprices"
                 // seater:"$carmodels.noOfSeats", 
            }
              
          }
        ])




/*

        let favouritesCarResult  = await FaviouritesModel.aggregate([
       {
        "$match": {customerId:  req.userId}
        },
            {
                $lookup:{
                    from: "cars",       // other table name
                    localField: "carId",   // name of users table field
                    foreignField: "_id", // name of userinfo table field
                    as: "carsdetails"         // alias for userinfo table
                }   
            }, 
            {   
              $project:{
                  _id : 1,
                  cars:"$carsdetails",
                 carType:"$carsdetails.carType",
                //   carImage:"$carsdetails.carImage",
                //   carRegisterImage:"$carsdetails.carRegisterImage",
                //   vehicleType:"$carsdetails.vehicleType",
                //   carBrandId:"$carsdetails.carBrandId",
                //   carBrandName:"$carsdetails.carBrandName",
                //   carModelId:"$carsdetails.carModelId",
                //   carModelName:"$carsdetails.carModelName",
                //   carMakeYear:"$carsdetails.carMakeYear",
                //   carColorAvailble:"$carsdetails.carColorAvailble",
                //   carFeatureId:"$carsdetails.carFeatureId",
                //   carFeatures:"$carsdetails.carFeatures",
                //   carSpecId:"$carsdetails.carSpecId",
                //   carSpecs:"$carsdetails.carSpecs",
                //   carBootCapacity:"$carsdetails.carBootCapacity",
                //   createdBy:"$carsdetails.createdBy",
                //   logDateCreated:"$carsdetails.logDateCreated",
                //   logDateModified:"$carsdetails.logDateModified",
                //   isFeatured:"$carsdetails.isFeatured",
                //   isFavorite: "$carsdetails.isFavorite",
                //   isActive: "$carsdetails.isActive",
                //   description:"$carsdetails.description",
                //   avg_rating:"$carsdetails.avg_rating"         
                 // carprice:"$carsprices"
                 // seater:"$carmodels.noOfSeats", 
            }
              
          }
        ])*/
        res.status(200).json({success: true,message: "Faviourites Successfully",data: availableCarResult});
  }
  catch{
      res.status(400).json({success: true, message: "Something Went wrong.Please try again"});
  }
  }