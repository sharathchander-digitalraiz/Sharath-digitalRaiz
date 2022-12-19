const bookings = require("../model/booking");
// const express = require("express");
// const app = express();

app.get("/all",async(req,res)=>{
    const allData = await bookings.aggregate([
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "CustomerDetails",
          },
        },
        { $unwind: "$CustomerDetails" },
        {
          $lookup: {
            from: "cars",
            localField: "carId",
            foreignField: "_id",
            as: "CarNumber",
          },
        },
        { $unwind: "$CarNumber" },
        {
          $lookup: {
              from: "payment",
              localField:"_id",
              foreignField: "bookingId",
              as:"PaymentDetails"
          },
        },
        {$unwind: "$PaymentDetails"},
        {
          $lookup: {
              from: "documents",
              localField:"customerId",
              foreignField:"customerId",
              as:"Documents"
          },
        },
        {$unwind:"Documents"},
        {
          $lookup:{
              from:"securityDeposits",
              to:"bookingId",
              from:"_id",
              as:"Deposit"
          },
        },
        {
          $project: {
              id:"$_id",
              customerName:1,
              phone:1,
              alternate_phone:1,
              timeSlot:1,
              fromDate:1,
              toDate:1,
              aadharNumber:1,
              dlNumber:1,
              price:1,
              discountPrice: 1,
              totalprice: 1,
              paymethod:1,
              securityDeposite:1,
          }
        }
      ]).exec();
      res.send(allData)
      
})
