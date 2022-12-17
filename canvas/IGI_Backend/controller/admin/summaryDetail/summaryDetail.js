const summaryDetailModel = require("../../../model/summaryDetail");
const QRCode = require("qrcode");
var fs = require("fs");
const mkdirp = require("mkdirp");
var multer = require("multer");
const { createCanvas, loadImage, registerFont } = require("canvas");

// add summary details without otp
exports.addSummaryDetails = async function (req, res) {
  //try {
  let sumId;
  const roes = await summaryDetailModel.find().countDocuments();

  if (roes > 0) {
    const data = await summaryDetailModel.findOne().sort({ _id: -1 });
    sumId = data.sumid != undefined ? data.sumid + 1 : 1;
  } else {
    sumId = 1;
  }
  const object = {
    summaryNumber: req.body.summaryNumber,
    image: req.file.path,
    description: req.body.description,
    shapeCut: req.body.shapeCut,
    totalEstWt: req.body.totalEstWt,
    color: req.body.color,
    clarity: req.body.clarity,
    comment: req.body.comment,
    sumid: sumId,
  };
  const qrcode = await qrCodegenerate(object);
  const softcopy = await idReportgenerate(object);

  const summaryDetailObj = new summaryDetailModel({
    summaryNumber: req.body.summaryNumber,
    image: req.file.path,
    description: req.body.description,
    shapeCut: req.body.shapeCut,
    totalEstWt: req.body.totalEstWt,
    color: req.body.color,
    clarity: req.body.clarity,
    comment: req.body.comment,
    sumid: sumId,
    qrcode: qrcode,
    softcopy: softcopy,
  });

  console.log(summaryDetailObj);

  summaryDetailObj.save(function (er, summary) {
    if (er) {
      res.status(400).json({ message: "Summary details could not be added" });
    }
    if (summary) {
      res.status(200).json({ message: "Summary details added successfully" });
    }
  });
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// get summary details by Id
exports.getSummaryDetails = async function (req, res) {
  try {
    const summaryResult = await summaryDetailModel.findById({
      _id: req.body._id,
    });

    res.status(200).json({ message: "Success", summaryResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get summary details by summary number or sumId
exports.getUserSummaryDetails = async function (req, res) {
  try {
    console.log(req.body);
    const summaryResult = await summaryDetailModel.findOne({
      sumid: parseInt(req.body.sumid),
    });

    res.status(200).json({ message: "Success", summaryResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

//
exports.getStringUserSummaryDetails = async function (req, res) {
  try {
    const summaryResult = await summaryDetailModel.findOne({
      summaryNumber: req.body.sumid,
    });
    res.status(200).json({ message: "Success", summaryResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all summary details
exports.getAllSummaryList = async function (req, res) {
  try {
    const summariesResult = await summaryDetailModel
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Success", summariesResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update summary details
exports.editSummary = async function (req, res) {
  try {
    const changeSummary = await summaryDetailModel.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        summaryNumber: req.body.summaryNumber,
        image: req.file.path,
        description: req.body.description,
        shapeCut: req.body.shapeCut,
        totalEstWt: req.body.totalEstWt,
        color: req.body.color,
        clarity: req.body.clarity,
        comment: req.body.comment,
      }
    );

    if (changeSummary) {
      res.status(200).json({ message: "Summary details updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// remove summary details
exports.removeSummary = async function (req, res) {
  try {
    const removeSummmaryDetails = await summaryDetailModel.findByIdAndDelete({
      _id: req.params.id,
    });

    if (removeSummmaryDetails) {
      res.status(200).json({ message: "Summary details removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// // call back for genaration of sumid
// async function generateId() {
//   const roes = await summaryDetailModel.find().countDocuments();
//   if (roes > "0") {
//     const data = await summaryDetailModel.findOne().sort({ _id: -1 });
//     return data["sumid"] + 1;
//   } else {
//     return 1;
//   }
// }

async function qrCodegenerate(object) {
  console.log("hello");
  const path = "http://igi-org.in/reports/verify-your-report/" + object.sumid;
  const qr_code_image_path = "images/qrcodes";
  const template_image_path = "images/templates";
  QRCode.toFile(
    qr_code_image_path + "/" + object.sumid + ".png",
    path,
    { version: 5 },

    function (err) {
      loadImage("./template.jpg").then((image) => {
        context.drawImage(image, 0, 0, 308, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + object.sumid + ".png",
          buffer
        );
        context.drawImage(image, 0, 0);
      });
      const width = 308;
      const height = 204;
      registerFont("./fonts/Lato-Black.ttf", { family: "Lato-Black" });
      registerFont("./fonts/Lato-Light.ttf", { family: "Lato-Regular" });
      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(template_image_path + object.sumid + ".png", buffer);
      const images = object.image;
      loadImage(images).then((image) => {
        context.drawImage(image, 240, 120, 50, 50);
        const buffers = canvas.toBuffer("image/png");
        fs.writeFileSync(images, buffers);
      });

      const qr_codes = qr_code_image_path + "/" + object.sumid + ".png";
      loadImage(qr_codes).then((image) => {
        context.fillStyle = "#000";
        context.font = "8px Lato-Black";
        context.textAlign = "left";
        context.fillText(object.summaryNumber, 82, 82);

        context.fillStyle = "#000";
        context.font = "8px Lato-Regular";
        context.textAlign = "left";

        var desline1 = object.description.substring(0, 55);
        var desline2 = object.description.substring(56, 124);
        context.fillText(desline1 + "\n" + desline2, 82, 91);

        context.fillStyle = "#000";
        context.font = "8px Lato-Regular";
        context.textAlign = "left";
        context.fillText(object.shapeCut, 82, 113);

        context.fillStyle = "#000";
        context.font = "8px Lato-Black";
        context.textAlign = "left";
        context.fillText(object.totalEstWt, 82, 122);

        context.fillStyle = "#000";
        context.font = "8px Lato-Black";
        context.textAlign = "left";
        context.fillText(object.color, 82, 132);

        context.fillStyle = "#000";
        context.font = "8px Lato-Black";
        context.textAlign = "left";
        context.fillText(object.clarity, 82, 142);

        context.fillStyle = "#000";
        context.font = "8px Lato-Regular";
        context.textAlign = "left";
        // context.fillText("Grading & identification of origin as \nmountain permits. Diamonds graded only.\nSummary number engraved.",
        // 445, 805);
        var comment1 = object.comment.substring(0, 37);
        var comment2 = object.comment.substring(38, 76);
        var comment3 = object.comment.substring(77, 100);
        context.fillText(
          comment1 + "\n" + comment2 + "\n" + comment3,
          82,
          152
        );

        context.drawImage(image, 125, 8, 50, 50);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + object.sumid + ".png",
          buffer
        );
        context.drawImage(image, 0, 0);
      });
    }
  );
  return template_image_path + "/" + object.sumid + ".png";
}

// generate id report
async function idReportgenerate(object) {
  console.log(object.sumid);
  const template_image_path = "images/softimages";

  loadImage("./igiTemplate57.png").then((image) => {
    context.drawImage(image, 0, 0, 1700, 1088);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(template_image_path + "/" + object.sumid + ".png", buffer);
    context.drawImage(image, 0, 0);
  });
  const width = 1700;
  const height = 1088;
  registerFont("./fonts/Lato-Black.ttf", { family: "Lato-Black" });
  registerFont("./fonts/Lato-Light.ttf", { family: "Lato-Regular" });
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(template_image_path + object.sumid + ".png", buffer);
  const images = object.image;
  loadImage(images).then((image) => {
    context.fillStyle = "#000";
    context.font = "38px Lato-Black";
    context.textAlign = "left";
    context.fillText(object.summaryNumber, 448, 405);

    context.fillStyle = "#000";
    context.font = "38px Lato-Regular";
    context.textAlign = "left";

    var desline1 = object.description.substring(0, 67);
    var desline2 = object.description.substring(68, 137);
    context.fillText(desline1 + "\n" + desline2, 448, 458);

    context.fillStyle = "#000";
    context.font = "38px Lato-Regular";
    context.textAlign = "left";
    context.fillText(object.shapeCut, 448, 562);

    context.fillStyle = "#000";
    context.font = "38px Lato-Black";
    context.textAlign = "left";
    context.fillText(object.totalEstWt, 448, 615);

    context.fillStyle = "#000";
    context.font = "38px Lato-Black";
    context.textAlign = "left";
    context.fillText(object.color, 448, 670);

    context.fillStyle = "#000";
    context.font = "38px Lato-Black";
    context.textAlign = "left";
    context.fillText(object.clarity, 448, 725);

    context.fillStyle = "#000";
    context.font = "38px Lato-Regular";
    context.textAlign = "left";
    // context.fillText("Grading & identification of origin as \nmountain permits. Diamonds graded only.\nSummary number engraved.",
    // 445, 805);
    var comment1 = object.comment.substring(0, 37);
    var comment2 = object.comment.substring(38, 76);
    var comment3 = object.comment.substring(77, 100);
    context.fillText(comment1 + "\n" + comment2 + "\n" + comment3, 448, 775);

    context.drawImage(image, 1365, 605, 242, 242);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(template_image_path + "/" + object.sumid + ".png", buffer);
    context.drawImage(image, 0, 0);
  });
  return template_image_path + "/" + object.sumid + ".png";
}

// get 8 cards at a time on a A4 sheet
exports.a4sizeshhet = async function (req, res) {
  try {
    let cardOneSearch = {};
    let cardTwoSearch = {};
    let cardThreeSearch = {};
    let cardFourSearch = {};
    let cardFiveSearch = {};
    let cardSixSearch = {};
    let cardSevenSearch = {};
    let cardEightSearch = {};

    const { summaryNos } = req.body;

    // console.log(summaryNos);

    if (summaryNos[0]) {
      cardOneSearch.summaryNumber = summaryNos[0].label;
    }
    const summeryOne = await summaryDetailModel.findOne(cardOneSearch);

    if (summaryNos[1]) {
      cardTwoSearch.summaryNumber = summaryNos[1].label;
    }
    const summeryTwo2 = await summaryDetailModel.findOne(cardTwoSearch);
    // console.log(summeryOne);

    if (summaryNos[2]) {
      cardThreeSearch.summaryNumber = summaryNos[2].label;
    }
    const summeryThree3 = await summaryDetailModel.findOne(cardThreeSearch);

    if (summaryNos[3]) {
      cardFourSearch.summaryNumber = summaryNos[3].label;
    }
    const summeryFour4 = await summaryDetailModel.findOne(cardFourSearch);

    if (summaryNos[4]) {
      cardFiveSearch.summaryNumber = summaryNos[4].label;
    }
    const summeryFive5 = await summaryDetailModel.findOne(cardFiveSearch);

    if (summaryNos[5]) {
      cardSixSearch.summaryNumber = summaryNos[5].label;
    }
    const summerySix6 = await summaryDetailModel.findOne(cardSixSearch);

    if (summaryNos[6]) {
      cardSevenSearch.summaryNumber = summaryNos[6].label;
    }
    const summerySeven7 = await summaryDetailModel.findOne(cardSevenSearch);

    if (summaryNos[7]) {
      cardEightSearch.summaryNumber = summaryNos[7].label;
    }
    const summeryEight8 = await summaryDetailModel.findOne(cardEightSearch);

    const template_image_path = "images/sheet";

    const width = 794;
    const height = 1126;
    // const width = 3508;
    // const height = 2480;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);

    const buffer = canvas.toBuffer("image/png");

    fs.writeFileSync(template_image_path + summeryOne.sumid + ".png", buffer);
    const images1 = summeryOne.qrcode;
    const images2 = summeryTwo2.qrcode;
    const images3 = summeryThree3.qrcode;
    const images4 = summeryFour4.qrcode;
    const images5 = summeryFive5.qrcode;
    const images6 = summerySix6.qrcode;
    const images7 = summerySeven7.qrcode;
    const images8 = summeryEight8.qrcode;

    // console.log(images1)

    if (images1) {
      loadImage(images1).then((image) => {
        // console.log(image);
        context.drawImage(image, 37, 106, 306, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + summeryOne.sumid + ".png",
          buffer
        );
      });
    } else {
      console.log("No image to print");
    }

    if (images2) {
      loadImage(images2).then((image) => {
        // console.log(image);
        context.drawImage(image, 396, 106, 306, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + summeryOne.sumid + ".png",
          buffer
        );
      });
    } else {
      console.log("No Image to print");
    }

    if (images3) {
      loadImage(images3).then((image) => {
        // console.log(image);
        context.drawImage(image, 37, 374, 306, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + summeryOne.sumid + ".png",
          buffer
        );
      });
    } else {
      console.log("No Image to print");
    }

    if (images4) {
      loadImage(images4).then((image) => {
        // console.log(image);
        context.drawImage(image, 396, 374, 306, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + summeryOne.sumid + ".png",
          buffer
        );
      });
    } else {
      console.log("No Image to print");
    }

    if (images5) {
      loadImage(images5).then((image) => {
        // console.log(image);
        context.drawImage(image, 37, 642, 306, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + summeryOne.sumid + ".png",
          buffer
        );
      });
    } else {
      console.log("No Image to print");
    }

    if (images6) {
      loadImage(images6).then((image) => {
        // console.log(image);
        context.drawImage(image, 396, 642, 306, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + summeryOne.sumid + ".png",
          buffer
        );
      });
    } else {
      console.log("No Image to print");
    }

    if (images7) {
      loadImage(images7).then((image) => {
        // console.log(image);
        context.drawImage(image, 37, 910, 306, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + summeryOne.sumid + ".png",
          buffer
        );
      });
    } else {
      console.log("No Image to print");
    }

    if (images8) {
      loadImage(images8).then((image) => {
        // console.log(image);
        context.drawImage(image, 396, 910, 306, 204);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + "/" + summeryOne.sumid + ".png",
          buffer
        );
      });
    } else {
      console.log("No Image to print");
    }

    if (
      images1 ||
      images2 ||
      images3 ||
      images4 ||
      images5 ||
      images6 ||
      images7 ||
      images8
    ) {
      res.status(200).json({ message: "Cards captured successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Please select atleast one card to print" });
    }
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }

  //return template_image_path + "/" + object.sumid + ".png";
};
