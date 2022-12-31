const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const generator = require("generate-serial-number");
const srl = generator.generate(5);
const Documents = require("./model/document");
const Payment = require("./model/payment");
const Car = require("./model/car");
const Booking = require("./model/booking");
const Customer = require("./model/customer");
const SecurityDeposit = require("./model/securityDeposit");

// exports.getReportDetails = async (req, res) => {
  try {
    let booking_id = req.body.id;
    const booking = await Booking.findOne(
      { _Id: booking_id },
      {
        carId: 1,
        customerId: 1,
        fromDate: 1,
        toDate: 1,
        timeSlot: 1,
      }
    );
    const payment = await Payment.findOne(
      { bookingId: booking_id },
      {
        price: 1,
        discountPrice: 1,
        totalprice: 1,
        toDate: 1,
        paymethod: 1,
      }
    );
    const document = await Documents.findOne(
      { customerId: booking.customerId },
      {
        aadharNumber: 1,
      }
    );
    const customer = await Customer.findOne(
      { _Id: booking.customerId } <
        {
          customerName: 1,
          phone: 1,
          alternate_phone: 1,
          dlNumber: 1,
        }
    );
    const car = await Car.findOne(
      { _Id: booking.carId },
      {
        carRegistNumber: 1,
      }
    );
    const securityDeposit = await SecurityDeposit.findOne(
      { bookingId: booking_id },
      {
        securityDeposite: 1,
      }
    );

// generate customer report
const template_image_path = "views";
loadImage("./freedomcars.png").then((image) => {
  context.drawImage(image, 0, 0, 1654, 2339);
  // const buffer = canvas.toBuffer("image/png");
  context.drawImage(image, 0, 0);
});
const width = 1654;
const height = 2339;
registerFont("./fonts/Lato-Black.ttf", { family: "Lato-Black" });
registerFont("./fonts/Lato-Light.ttf", { family: "Lato-Regular" });
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

loadImage("./freedomcars.png").then((image) => {
  //CUSTOMER NAME
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("SHARATH", 235, 400);

  //PACKAGE NAME(time slot)
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("6", 1140, 400);

  //MOBILE
  context.fillStyle = "#000";
  context.font = "25px Lato-Black"; //"25px Lato-Black";
  context.fillText("9632587410", 350, 485);
  context.textAlign = "left";

  //Alternate mobile number
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("7412589630", 405, 574);

  //from date
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("22-12-2022 06:00", 1210, 488);

  //to date
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("25-12-2022 12:00", 1210, 575);

  //Aadhar number
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("9632 5874 1014", 318, 662);

  //licence number
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("BGG445552", 319, 748);

  //Car number
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("TS 12 BV 2025", 275, 834);

  //price (total amount)
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("5000", 1148, 662);

  //discount
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("500", 1080, 748);

  //total amount(final amount)
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("4500", 1140, 834);

  //Laptop or bike or cash ..
  context.fillStyle = "#000";
  context.font = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("Laptop", 895, 920);

  //payment method..
  context.fillStyle = "#000";
  context.fot = "25px Lato-Black";
  context.textAlign = "left";
  context.fillText("Cash", 1155, 1085);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(template_image_path + "/" + srl + ".png", buffer);
  context.drawImage(image, 0, 0);
});

  } catch (err) {
    res
      .status(400)
      .json({ success: true, message: "something went wrong", Error: err });
  }


