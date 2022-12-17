const residential_house = require("../../model/residential_house");
const unique_nos = require("../../model/unique_nos");
const zones = require("../../model/zones");
const pwdhash = require("node-php-password");
const users = require("../../model/users");
const circles = require("../../model/circles");
const wards = require("../../model/wards");
const areas = require("../../model/area");
const landmark = require("../../model/landmarks");
const Str = require("@supercharge/strings");
var multer = require("multer");
var excelToJson = require("convert-excel-to-json");
var fs = require("fs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const { createCanvas, loadImage } = require("canvas");

exports.import_data_residential = async (req, res) => {
  const { user_id } = req.body;
  importExcelData2MongoDB("./uploads/excel/" + req.file.filename, user_id);
  responseObject = {
    success: true,
    login: true,
    message: "Successfully completed"
  };
  res.status(200).json(responseObject);
};

// Import Excel File to MongoDB database
async function importExcelData2MongoDB(filePath, user_id) {
  console.log(filePath);
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Excel Sheet Name
        name: "Total",
        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1
        },
        // Mapping columns to keys
        columnToKey: {
          A: "Zone",
          B: "circle",
          C: "ward",
          D: "area",
          E: "landmark",
          F: "property_no",
          G: "house_address",
          H: "owner_name",
          I: "owner_mobile_number",
          J: "owner_aadhar",
          K: "resident_type",
          L: "existing_disposal",
          M: "Quantity",
          N: "weight",
          O: "coordinates",
          P: "eighteenabove",
          Q: "eighteenbelow"
        }
      }
    ]
  });
  // -> Log Excel Data to Console
  //console.log(excelData);
  var i = 0;
  const docs = [];
  await Promise.all(
    excelData.Total.map(async (element, dind) => {
      console.log(element);
      const zonerow = await zones
        .findOne({ name: element.Zone }, { _id: 1, tenent_id: 1 })
        .exec();
      console.log(zonerow);
      const circlerow = await circles
        .findOne({ name: element.circle }, { _id: 1 })
        .exec();
      console.log(circlerow);
      const wardrow = await wards
        .findOne({ name: element.ward }, { _id: 1 })
        .exec();
      console.log(wardrow);
      const landmarkrow = await landmark
        .findOne({ landmark_from: element.landmark }, { _id: 1 })
        .exec();
      console.log(landmarkrow);
      const arearow = await areas
        .findOne({ name: element.area }, { _id: 1 })
        .exec();
      console.log(arearow);
      var d = new Date();
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based

      var curr_year = d.getFullYear();
      if (curr_month > 10) {
        curr_month = curr_month;
      } else {
        curr_month = "0" + curr_month;
      }
      var dates = curr_year + "-" + curr_month + "-" + curr_date;
      const place = {};
      place.type = "Point";
      place.coordinates = [];
      let cor = element.coordinates.split(",");
      place.coordinates.push(Number(cor[0]));
      place.coordinates.push(Number(cor[1]));
      // console.log(place)
      docs.push({
        uuid: uuidv4(),
        date: dates,
        zone: element.Zone,
        circle: element.circle,
        ward_name: element.ward,
        area: element.area,
        landmark: element.landmark,
        type: element.resident_type,
        house_address: element.house_address,
        propertyno: element.property_no,
        owner_name: element.owner_name,
        owner_aadhar: element.owner_aadhar,
        owner_mobile: element.owner_mobile_number,
        existing_disposal: element.existing_disposal,
        weight: element.weight,
        wastage_quantity: element.Quantity,
        zones_id: zonerow._id,
        circles_id: circlerow._id,
        ward_id: wardrow._id,
        landmark_id: landmarkrow._id,
        area_id: arearow._id,
        tenent_id: zonerow.tenent_id,
        eighteenabove: element.eighteenabove,
        eighteenbelow: element.eighteenbelow,
        user_id: user_id,
        place: place
      });
    })
  );
  console.log(docs);
  await Promise.all(
    docs.map(async (val, index) => {
      const qr_code_image_path =
        "uploads/qr-images/residential_house/qr_codes/";
      var template_image_path =
        "uploads/qr-images/residential_house/templates/";

      var circles = val.circle;
      fs.mkdir(qr_code_image_path + circles, function (err) {});
      fs.mkdir(template_image_path + circles, function (err) {});
      var unique_no = await module.exports.generate();
      QRCode.toFile(
        qr_code_image_path + circles + "/" + unique_no + ".png",
        unique_no,
        { version: 10 },
        function (err) {
          loadImage("./complex_building.jpg").then((image) => {
            context.drawImage(image, 0, 0, 1152, 1920);
            const buffer = canvas.toBuffer("image/png");
            fs.writeFileSync(
              template_image_path + circles + "/" + unique_no + ".png",
              buffer
            );
            context.drawImage(image, 0, 0);
          });
          const width = 698;
          const height = 1280;
          const canvas = createCanvas(width, height);
          const context = canvas.getContext("2d");
          context.fillStyle = "#fff";
          context.fillRect(0, 0, width, height);

          const buffer = canvas.toBuffer("image/png");
          fs.writeFileSync(
            template_image_path + circles + "/" + unique_no + ".png",
            buffer
          );
          const qr_codes =
            qr_code_image_path + circles + "/" + unique_no + ".png";
          loadImage(qr_codes).then((image) => {
            context.fillStyle = "#000";
            context.font = "28px cambria";
            context.textAlign = "left";
            context.fillText(val.owner_name, 435, 807);

            //  //vehicle type
            context.fillStyle = "#000";
            context.font = "28px cambria";
            context.textAlign = "left";
            context.fillText(val.house_address, 435, 865);
            //vehicle registeration no
            context.fillStyle = "#000";
            context.font = "28px cambria";
            context.textAlign = "left";
            context.fillText(val.type, 435, 915);
            //  //location
            context.fillStyle = "#000";
            context.font = "28px cambria";
            context.textAlign = "left";
            context.fillText(val.landmark, 435, 968);
            //  //ward
            context.fillStyle = "#000";
            context.font = "28px cambria";
            context.textAlign = "left";
            context.fillText(val.area, 435, 1018);
            //  //circle
            context.fillStyle = "#000";
            context.font = "28px cambria";
            context.textAlign = "left";
            context.fillText(val.ward_name, 435, 1068);
            //  //zone
            context.fillStyle = "#000";
            context.font = "28px cambria";
            context.textAlign = "left";
            context.fillText(val.circle, 435, 1118);

            context.fillStyle = "#000";
            context.font = "28px cambria";
            context.textAlign = "left";
            context.fillText(val.zone, 435, 1168);

            context.drawImage(image, 155, 330, 380, 380);
            const buffer = canvas.toBuffer("image/png");
            fs.writeFileSync(
              template_image_path + circles + "/" + unique_no + ".png",
              buffer
            );
            context.drawImage(image, 0, 0);
          });
        }
      );
      const unique_noss = new unique_nos({
        unique_no: unique_no,
        user_id: user_id,
        type_db: "residential_houses"
      });

      unique_noss.save();
      console.log("val");
      console.log(val);

      const list = new residential_house({
        uuid: val.uuid,
        date: val.date,
        zone: val.zone,
        circle: val.circle,
        ward_name: val.ward_name,
        area: val.area,
        landmark: val.landmark,
        type: val.type,
        house_address: val.house_address,
        propertyno: val.propertyno,
        owner_name: val.owner_name,
        owner_aadhar: val.owner_aadhar,
        owner_mobile: val.owner_mobile,
        existing_disposal: val.existing_disposal,
        quality_waste: val.wastage_quantity,
        wastage_quantity: val.weight,
        zones_id: val.zones_id,
        circles_id: val.circles_id,
        ward_id: val.ward_id,
        landmark_id: val.landmark_id,
        area_id: val.area_id,
        tenent_id: val.tenent_id,
        user_id: val.user_id,
        place: val.place,
        unique_no: unique_no,
        eighteenabove: val.eighteenabove,
        eighteenbelow: val.eighteenbelow,
        qr_image: template_image_path + circles + "/" + unique_no + ".png",
        qr_code_view: template_image_path + circles + "/" + unique_no + ".png"
      });

      await list.save();
    })
  );
}

exports.generate = async (req, res) => {
  const string = Str.random(25);
  const checkstring = await residential_house
    .findOne({ unique_no: string }, { _id: 1 })
    .countDocuments();
  if (checkstring == 0) {
    return string;
  } else {
    module.exports.generate();
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/excel");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

exports.upload_user_res = multer({ storage: storage });
