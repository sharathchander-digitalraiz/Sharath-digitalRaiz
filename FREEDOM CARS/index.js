const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const generator = require("generate-serial-number");
const srl = generator.generate(5);
const customer = require("./model/customer");
const documents = require("./model/document");
const payments = require("./model/payment");
const car = require("./model/car");
const booking = require("./model/booking")



const object = {
  summaryNumber: 9662555525,
  name: "ram",
};
reportGenerate(object);

// generate customer report
async function reportGenerate(object) {
  console.log(srl);
  const template_image_path = "views";

  loadImage("./freedomcars.png").then((image) => {
    context.drawImage(image, 0, 0, 1654, 2339);
    const buffer = canvas.toBuffer("image/png");
    context.drawImage(image, 0, 0);
  });
  const width = 1654;
  const height = 2339;
  registerFont("./fonts/Lato-Black.ttf", { family: "Lato-Black" });
  registerFont("./fonts/Lato-Light.ttf", { family: "Lato-Regular" });
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  
  loadImage("./freedomcars.png").then((image) => {
    context.fillStyle = "#000";
    context.font = "38px Lato-Regular";
    context.textAlign = "left";
    context.fillText(object.summaryNumber, 440, 495);

    context.fillStyle = "#000";
    context.font = "38px Lato-Regular"; //"38px Lato-Regular";
    context.fillText(object.name , 440, 405);
    context.textAlign = "left";
    console.log(object.name)

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(template_image_path + "/" + srl + ".png", buffer);
    context.drawImage(image, 0, 0);
  });
  return template_image_path + "/" + srl + ".png";
}


