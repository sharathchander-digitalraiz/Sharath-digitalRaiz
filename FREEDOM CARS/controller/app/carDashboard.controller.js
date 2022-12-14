const carModel = require("../../model/car");
const carBannerModel = require("../../model/carBanner");
const carmodelModel =require("../../model/carModel");

// get dashboard items
exports.getAppHomeItems = async function (req, res) {
 // try {
    let condition = {};

    if (req.body.carType && req.body.carType != "All") {
      condition.carType = req.body.carType;
    }

    const actBannerResult = await carBannerModel
      .find({ isActive: true })
      .sort({ logDateCreated: -1 });

    // const availableCarResult = await carModel
    //   .find(condition)
    //   .sort({ logDateCreated: -1 });

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



    //   let availableCarResult  = await carModel.aggregate([
    //     {
    //         "$match":condition
    //     },
    //     {
    //         $lookup:{
    //             from: "carModels",       // other table name
    //             localField: "carModelId",   // name of users table field
    //             foreignField: "_id", // name of userinfo table field
    //             as: "carslist"         // alias for userinfo table
    //         }   
    //     },  
    //     {   $unwind:"$carslist" }, 
    //     {   
    //       $project:{
    //           _id : 1
    //       }
          
    //   }
    // ])
    // console.log(availableCarResult);

    
   let popularCarResult  = await carModel.aggregate([
    {
        "$match":{isActive: true, isPopular: true}
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





    // const popularCarResult = await carModel
    //   .find({ isActive: true, isPopular: true })
    //   .sort({ logDateCreated: -1 });


    
   let featuredCarResult  = await carModel.aggregate([
    {
        "$match":{isActive: true, isFeatured: true}
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



    // const featuredCarResult = await carModel
    //   .find({ isActive: true, isFeatured: true })
    //   .sort({ logDateCreated: -1 });

    res.status(200).json({
      message: "Success",
      actBannerResult,
      availableCarResult,
      popularCarResult,
      featuredCarResult
    });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

// car search in home page
exports.carSearch = async function (req, res) {
  try {
    let regex = new RegExp(req.query.searchQuery, "i");

    console.log(regex);

    const carSearchResult = await carModel
      .find({
        $or: [
          { title: regex },
          { pricePerDay: regex },
          { carType: regex },
          { vehicleType: regex },
          { carBrandName: regex }
        ]
      })
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", carSearchResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get filtered cars in app filter section
exports.getFilteredCars = async function (req, res) {
  try {
    let condition = {};
    let sortCondition = {};

    sortCondition.logDateCreated = -1;

    if (req.body.carBrandId && req.body.carBrandId != "All") {
      condition.carBrandId = req.body.carBrandId;
    }
    if (req.body.carType && req.body.carType != "All") {
      condition.carType = req.body.carType;
    }
    if (req.body.vehicleType) {
      condition.vehicleType = req.body.vehicleType;
    }
    if (req.body.pricePerDay && req.body.pricePerDay != "All") {
      sortCondition.pricePerDay = req.body.pricePerDay;
    }

    console.log(condition);
    console.log(sortCondition);

    const availableCarResult = await carModel
      .find(condition)
      .sort(sortCondition);

    res.status(200).json({ message: "Success", availableCarResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};


exports.gettypecars = async function (req, res) {
   try {
     let condition = {};
 
     console.log(req.body);
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
               seatCount:1, 
               description:1,
               avg_rating:1,           
               carprice:"$carsprices"
         }
           
       }
     ])

     res.status(200).json({
       message: "Success",
       availableCarResult
     });
   } catch (err) {
     res.status(400).json({ message: "Bad request" });
   }
 };