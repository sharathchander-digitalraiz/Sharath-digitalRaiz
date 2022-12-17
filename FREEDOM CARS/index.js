const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const generator = require("generate-serial-number");
let srl = generator.generate(5);

const object = {
  summaryNumber: 5215165,
  //   image: "r45am",
  //   description: req.body.description,
  //   shapeCut: req.body.shapeCut,
  //   totalEstWt: req.body.totalEstWt,
  //   color: req.body.color,
  //   clarity: req.body.clarity,
  //   comment: req.body.comment,
  //   sumid: sumId,
};
reportGenerate(object);

// async function reportGenerate(object) {
//   const template_image_path = "views";
//   const width = 1654;
//   const height = 2339;
//   //   loadImage("./freedomcars.png").then((image) => {
//   //     context.drawImage(image, 0, 0, 1654, 2339);
//   //     const buffer = canvas.toBuffer("image/png");
//   //     fs.writeFileSync(template_image_path + "/" + srl + ".png", buffer);
//   //     context.drawImage(image, 0, 0);
//   //   });

//   //   registerFont("./fonts/Lato-Black.ttf", { family: "Lato-Black" });
//   //   registerFont("./fonts/Lato-Light.ttf", { family: "Lato-Regular" });
//   //   const canvas = createCanvas(width, height);
//   //   const context = canvas.getContext("2d");
//   //   context.fillStyle = "#fff";
//   //   context.fillRect(0, 0, width, height);

//   const buffer = canvas.toBuffer("image/png");
//   fs.writeFileSync(template_image_path + srl + ".png", buffer);
//   // const images = object.image;
//   loadImage("./freedomcars.png").then((image) => {
//     context.fillStyle = "#000";
//     context.font = "38px Lato-Black";
//     context.textAlign = "left";
//     context.fillText(object.summaryNumber, 448, 405);
//     console.log(image);
//     context.fillStyle = "#000";
//     context.font = "38px Lato-Regular";
//     context.textAlign = "left";

//     registerFont("./fonts/Lato-Black.ttf", { family: "Lato-Black" });
//     registerFont("./fonts/Lato-Light.ttf", { family: "Lato-Regular" });
//     const canvas = createCanvas(width, height);
//     const context = canvas.getContext("2d");
//     context.fillStyle = "#fff";
//     context.fillRect(0, 0, width, height);

//     // var desline1 = object.description.substring(0, 67);
//     // var desline2 = object.description.substring(68, 137);
//     // context.fillText(desline1 + "\n" + desline2, 448, 458);

//     // var comment1 = object.comment.substring(0, 37);
//     // var comment2 = object.comment.substring(38, 76);
//     // var comment3 = object.comment.substring(77, 100);
//     // context.fillText(comment1 + "\n" + comment2 + "\n" + comment3, 448, 775);

//     context.drawImage(image, 1365, 605, 242, 242);
//     const buffer = canvas.toBuffer("image/png");
//     fs.writeFileSync(template_image_path + "/" + srl + ".png", buffer);
//     context.drawImage(image, 0, 0);
//   });
//   //return template_image_path + "/" + srl + ".png";
// }

async function reportGenerate(err) {
  const template_image_path = "views";
  const width = 1654;
  const height = 2339;
  loadImage("./freedomcars.png").then((image) => {
    context.drawImage(image, 0, 0, width, height);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(
      template_image_path + circles + "/" + srl + ".png",
      buffer
    );
    context.drawImage(image, 0, 0);
  });

  registerFont("./fonts/Lato-Black.ttf", { family: "Lato-Black" });
  registerFont("./fonts/Lato-Light.ttf", { family: "Lato-Regular" });
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(template_image_path + circles + "/" + srl + ".png", buffer);
  const qr_codes = qr_code_image_path + circles + "/" + srl + ".png";
  loadImage(qr_codes).then((image) => {
    context.fillStyle = "#000";
    context.font = "28px cambria";
    context.textAlign = "left";
    context.fillText(object.summaryNumber, 435, 807);
    console.log(object.summaryNumber);

    context.drawImage(image, 155, 330, 380, 380);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(
      template_image_path + circles + "/" + srl + ".png",
      buffer
    );
    context.drawImage(image, 0, 0);
  });
}

// var fs = require('fs')
// var path = require('path')
// var Canvas = require('canvas');
// const { contextsKey } = require("express-validator/src/base");

// function fontFile (name) {
//   return path.join(__dirname, '/views/', name)
// }

// // Canvas.registerFont(fontFile('ARBLI___0.ttf'), {family: 'ARBLI___0'})

// var canvas = Canvas.createCanvas(1654, 2339)
// var ctx = canvas.getContext('2d')

// var Image = Canvas.Image;
// var img = new Image();
// img.src = 'views/FREEDOMCARS-1.jpg';

// ctx.clearRect(0, 0, canvas.width, canvas.height);
// ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

// ctx.fillStyle = 'white';
// ctx.textAlign = 'center';

// //ctx.font = '150pt ARBLI___0'
// ctx.fillText('यह मिसिसिपी है',500, 500)

// canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'FREEDOMCARS.jpg')))
// canvas.createJPEGStream().pipe(fs.createWriteStream(path.join(__dirname, 'FREEDOMCARS.jpg')))

// let Jimp = require('jimp')

// let image = new Jimp(300, 530, (err, image) => {
//   if (err) throw err
// })

// let message = 'Hello!'
// let x = 10
// let y = 10

// Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
//   .then(font => {
//     image.print(font, x, y, message)
//     return image
//   }).then(image => {
//     let file = `FreedomCars.jpg`
//     return image.write(file) // save
//   })

// const express = require("express");
// const app = express();
// // const { createCanvas, loadImage } = require("canvas");
// const port = process.env.PORT || 2500;
// // const {Canvas} = require('canvas-constructor');
// const Canvas = require("canvas");
// const path = require("path");

// app.use(express.static('views'));

// app.get('/:feed', async (req, res) => {
//     fs.readFile(__dirname + '/image.jpg', async function(err, data) {

//     if (err) throw err;
//     const img = await Canvas.loadImage(data);
//     const canvas = new Canvas(img.width, img.height);
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);

//     let image = new Canvas(1654, 2339)
//     .printImage(img, 0, 0, 550, 267)
//     .setTextFont('28px Impact')
//     .printText(req.params.feed, 40, 150)
//     .toBuffer();
// const imgBuffer =

//     res.set({'Content-Type': 'image/jpeg'})//setting content type as png image!
//     res.send(image)//sending the image!

// })
// http.createServer(function (req, res) {
//     fs.readFile(__dirname + '/image.jpg', async function(err, data) {
//         if (err) throw err;
//         const img = await Canvas.loadImage(data);
//         const canvas = new Canvas(img.width, img.height);
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);

//         res.write('<html><body>');
//         res.write('<img src="' + canvas.toDataURL() + '" />');
//         res.write('</body></html>');
//         res.end();
//     });
