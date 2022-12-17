const vehicles = require("../../model/vehicles");
const users = require("../../model/users");
const uniqueNoModel = require("../../model/unique_nos");
const Useraccesses = require("../../model/useraccess");
var multer = require("multer");
// const qr_codeImage = require("../../164856549644.png");
// const pwdhash = require("node-php-password");
// const tenent = require("../../model/tenent");
const zone = require("../../model/zones");
const circle = require("../../model/circles");
const wards = require("../../model/wards");
const landmark = require("../../model/landmarks");
const area_s = require("../../model/area");
const owner = require("../../model/ownertype");
const vehicle_type = require("../../model/vechile_type");
const Str = require("@supercharge/strings");
const QRCode = require("qrcode");
const mongoose = require("mongoose"); // or ObjectID
const ObjectId = mongoose.Types.ObjectId;
var fs = require("fs");
const mkdirp = require("mkdirp");
const { createCanvas, loadImage, registerFont } = require("canvas");

exports.addVehicles = async (req, res) => {
  console.log(req.body);
  const {
    user_id,
    zone_id,
    circle_id,
    ward_id,
    area_id,
    land_mark_id,
    owner_type_id,
    vechile_type_id,
    reg_no,
    sfa_id,
    driver_name,
    driver_mobile,
    transfer_station_id,
    area
  } = req.body;
  console.log(req.body);
  console.log("vehicle");
  console.log(req.file);
  const crows = await vehicles
    .find({ vehicle_registration_number: reg_no }, { _id: 1 })
    .countDocuments();
  if (crows == 0) {
    const zonerow = await zone
      .find({ _id: zone_id }, { _id: 1, name: 1, tenent_id: 1 })
      .exec();
    const circlerow = await circle
      .find({ _id: circle_id }, { _id: 1, name: 1, circle_no: 1 })
      .exec();
    const wardsrow = await wards
      .find({ _id: ward_id }, { _id: 1, name: 1, wards_no: 1 })
      .exec();
    const areasrow = await area_s
      .find({ _id: area_id }, { _id: 1, name: 1 })
      .exec();
    const landmarkrow = await landmark
      .findOne(
        { _id: land_mark_id },
        { _id: 1, landmark_from: 1, landmark_to: 1 }
      )
      .exec();
    const usersrow = await users.find({ _id: sfa_id }).exec();
    const ownerrow = await owner
      .find({ _id: owner_type_id }, { _id: 1, name: 1 })
      .exec();
    const transfer_station_row = await users
      .find({ _id: transfer_station_id })
      .exec();
    const vehicle_type_row = await vehicle_type
      .find({ _id: vechile_type_id })
      .exec();
    // var unique_no = await module.exports.generate();

    const qr_code_image_path = "images/qr-images/vehicle/qr_codes/";
    var template_image_path = "images/qr-images/vehicle/templates/";
    const vehicle_image = req.file.filename;
    var circles = circlerow[0].name.replace(" ", "-");
    fs.mkdir(qr_code_image_path + circles, function (err) {});
    fs.mkdir(template_image_path + circles, function (err) {});
    var unique_no = await module.exports.generate();

    // QRCode.toFile()
    const qrc = template_image_path + circles + "/" + unique_no + ".png";
    const save_vehicles = new vehicles({
      image: "uploads/vehicle/images/" + vehicle_image,
      zone: zonerow[0].name,
      circle_no: circlerow[0].circle_no,
      circle: circlerow[0].name,
      area_name: areasrow[0].name,
      wards_no: wardsrow[0].wards_no,
      ward_name: wardsrow[0].name,
      location: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
      // incharge: usersrow[0].first_name + '-' + usersrow[0].last_name,
      incharge: usersrow[0].first_name + "-" + usersrow[0].last_name,
      // incharge_mobile_number: usersrow[0].mobile_number,
      incharge_mobile_number: usersrow[0].mobile_number,
      vehicle_registration_number: reg_no,
      owner_type_id: owner_type_id,
      owner_type: ownerrow[0].name,
      driver_name: driver_name,
      driver_number: driver_mobile,
      transfer_station:
        transfer_station_row[0].first_name +
        "-" +
        transfer_station_row[0].last_name,
      transfer_station_id: transfer_station_id,
      area_id: area_id,
      qr_code_view: qrc,
      unique_no: unique_no,
      tenent_id: zonerow[0].tenent_id,
      zones_id: zone_id,
      circles_id: circle_id,
      ward_id: ward_id,
      landmark_id: land_mark_id,
      vehicle_type_id: vechile_type_id,
      vehicle_type: vehicle_type_row[0].name,
      log_date_modified: "",
      created_by: req.user.user_id,
      sfa_id: sfa_id
    });
    //area_id:area_id,
    save_vehicles.save(async (error, user) => {
      if (error)
        return res
          .status(400)
          .json({ success: false, login: true, message: error });
      if (user) {
        /**********************                    ********************************************************************************
         * ********************Qrcode generation************************************************************************************
         * *************************************************************************************************************************/
        var tunique_no = new String(user._id);
        console.log("tunique_no:" + tunique_no);
        var runique_no = tunique_no.split(":");
        unique_no = await ObjectId(user._id).toString();
        console.log(
          "**********************************************Worset Person*****************************************************************"
        );
        QRCode.toFile(
          qr_code_image_path + circles + "/" + unique_no + ".png",
          unique_no,
          { version: 10 },
          function (err) {
            loadImage("./template.jpg").then((image) => {
              context.drawImage(image, 0, 0, 1152, 1920);
              const buffer = canvas.toBuffer("image/png");
              fs.writeFileSync(
                template_image_path + circles + "/" + unique_no + ".png",
                buffer
              );
              // fs.writeFileSync("http://103.171.181.73:2000/uploads/tenent/1648565496442-download%20(4).png",buffer);
              context.drawImage(image, 0, 0);
              // context.drawImage(image, 230, 410, 580, 580);
            });

            // loadImage("164856549644.png").then((image) => {

            //   context.drawImage(image, 0, 0, 0, 0);
            //   const buffer = canvas.toBuffer('image/png');
            //   fs.writeFileSync("164856549644.png",buffer);
            //   context.drawImage(image, 0, 0);
            // });

            const width = 1152;
            const height = 1920;
            registerFont("./fonts/Cambria.ttf", { family: "Cambria" });
            const canvas = createCanvas(width, height);
            const context = canvas.getContext("2d");
            context.fillStyle = "#fff";
            context.fillRect(0, 0, width, height);

            const buffer = canvas.toBuffer("image/png");
            fs.writeFileSync(
              template_image_path + circles + "/" + unique_no + ".png",
              buffer
            );
            //const qr_codes = "/home/ghmcapp/public_html/ghmc_api/" + qr_code_image_path + circles + '/' + unique_no + '.png';
            const qr_codes = "164856549644.png";
            // const qr_codes = qr_codeImage;
            console.log(qr_codes);
            loadImage(qr_codes).then((image) => {
              context.fillStyle = "#000";
              context.font = "45px";
              context.textAlign = "left";
              context.fillText(ownerrow[0].name, 625, 1165);

              //  //vehicle type
              context.fillStyle = "#000";
              context.font = "45px";
              context.textAlign = "left";
              context.fillText(vehicle_type_row[0].name, 625, 1275);

              //vehicle registeration no
              context.fillStyle = "#000";
              context.font = "45px";
              context.textAlign = "left";
              context.fillText(reg_no, 625, 1385);

              //  //location
              context.fillStyle = "#000";
              context.font = "45px";
              context.textAlign = "left";
              context.fillText(landmarkrow.landmark_from, 625, 1475);
              //  //ward
              context.fillStyle = "#000";
              context.font = "45px";
              context.textAlign = "left";
              context.fillText(wardsrow[0].name, 625, 1565);
              //  //circle
              context.fillStyle = "#000";
              context.font = "45px";
              context.textAlign = "left";
              context.fillText(circlerow[0].name, 625, 1655);
              //  //zone
              context.fillStyle = "#000";
              context.font = "45px";
              context.textAlign = "left";
              context.fillText(zonerow[0].name, 625, 1735);
              context.drawImage(image, 260, 510, 580, 580);
              const buffer = canvas.toBuffer("image/png");
              // fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
              fs.writeFileSync(qr_codes, buffer);
              context.drawImage(image, 0, 0);
            });
          }
        );
        /***********                     ******************************
         * ***********END QRCODE GENERATION*******************************
         *************************************************************/
        var re = await vehicles.updateOne(
          { _id: user._id },
          {
            unique_no: unique_no,
            qr_image:
              "images/qr-images/vehicle/templates/" +
              circles +
              "/" +
              unique_no +
              ".png",
            qr_code_view:
              "images/qr-images/vehicle/templates/" +
              circles +
              "/" +
              unique_no +
              ".png"
          }
        );
        responseObject = {
          success: true,
          login: true,
          message: "Saved successfully"
        };
        res.status(200).json(responseObject);
      }
    });
  } else {
    responseObject = {
      success: false,
      login: true,
      message: "vehicle registerd number  already registered"
    };
    res.status(400).json(responseObject);
  }
};

exports.addadminVehicles = async (req, res) => {
  const {
    user_id,
    zone_id,
    circle_id,
    ward_id,
    land_mark_id,
    owner_type_id,
    vechile_type_id,
    reg_no,
    sfa_name,
    sfa_mobile,
    driver_name,
    driver_mobile,
    transfer_station_id,
    area,
    sfa_id
  } = req.body;
  const crows = await vehicles
    .find({ vehicle_registration_number: reg_no }, { _id: 1 })
    .countDocuments();
  if (crows == 0) {
    console.log(vechile_type_id);
    const zonerow = await zone
      .find({ _id: zone_id }, { _id: 1, name: 1, tenent_id: 1 })
      .exec();
    const circlerow = await circle
      .find({ _id: circle_id }, { _id: 1, name: 1, circle_no: 1 })
      .exec();
    const wardsrow = await wards
      .find({ _id: ward_id }, { _id: 1, name: 1, wards_no: 1 })
      .exec();
    const landmarkrow = await landmark
      .findOne(
        { _id: land_mark_id },
        { _id: 1, landmark_from: 1, landmark_to: 1 }
      )
      .exec();
    const usersrow = await users.find({ _id: sfa_id }).exec();
    const ownerrow = await owner
      .find({ _id: owner_type_id }, { _id: 1, name: 1 })
      .exec();
    const transfer_station_row = await users
      .find({ _id: transfer_station_id })
      .exec();
    const vehicle_type_row = await vehicle_type
      .find({ _id: vechile_type_id })
      .exec();
    var unique_no = await module.exports.generate();
    /**********************                    ********************************************************************************
     * ********************Qrcode generation************************************************************************************
     * *************************************************************************************************************************/
    const qr_code_image_path = "uploads/qr-images/vehicle/qr_codes/";
    var template_image_path = "uploads/qr-images/vehicle/templates/";
    var circles = circlerow[0].name.replace(" ", "-");
    fs.mkdir(qr_code_image_path + circles, function (err) {});
    fs.mkdir(template_image_path + circles, function (err) {});
    var unique_no = await module.exports.generate();
    QRCode.toFile(
      qr_code_image_path + circles + "/" + unique_no + ".png",
      unique_no,
      { version: 10 },
      function (err) {
        loadImage("./template.png").then((image) => {
          context.drawImage(image, 0, 0, 1152, 1920);
          const buffer = canvas.toBuffer("image/png");
          fs.writeFileSync(
            template_image_path + circles + "/" + unique_no + ".png",
            buffer
          );
          context.drawImage(image, 0, 0);
        });
        const width = 1152;
        const height = 1920;
        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);

        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + circles + "/" + unique_no + ".png",
          buffer
        );
        //const qr_codes = "/home/ghmcapp/public_html/ghmc_api/" + qr_code_image_path + circles + '/' + unique_no + '.png';
        const qr_codes =
          qr_code_image_path + circles + "/" + unique_no + ".png";
        loadImage(qr_codes).then((image) => {
          context.fillStyle = "#000";
          context.font = "45px cambria";
          context.textAlign = "left";
          context.fillText(ownerrow[0].name, 625, 1165);

          //  //vehicle type
          context.fillStyle = "#000";
          context.font = "45px cambria";
          context.textAlign = "left";
          context.fillText(vehicle_type_row[0].name, 625, 1275);

          //vehicle registeration no
          context.fillStyle = "#000";
          context.font = "45px cambria";
          context.textAlign = "left";
          context.fillText(reg_no, 625, 1385);

          //  //location
          context.fillStyle = "#000";
          context.font = "45px cambria";
          context.textAlign = "left";
          context.fillText(landmarkrow.landmark_from, 625, 1475);
          //  //ward
          context.fillStyle = "#000";
          context.font = "45px cambria";
          context.textAlign = "left";
          context.fillText(wardsrow[0].name, 625, 1565);
          //  //circle
          context.fillStyle = "#000";
          context.font = "45px cambria";
          context.textAlign = "left";
          context.fillText(circlerow[0].name, 625, 1655);
          //  //zone
          context.fillStyle = "#000";
          context.font = "45px cambria";
          context.textAlign = "left";
          context.fillText(zonerow[0].name, 625, 1735);
          context.drawImage(image, 260, 510, 580, 580);
          const buffer = canvas.toBuffer("image/png");
          fs.writeFileSync(
            template_image_path + circles + "/" + unique_no + ".png",
            buffer
          );
          context.drawImage(image, 0, 0);
        });
      }
    );
    /***********                     ******************************
     * ***********END QRCODE GENERATION*******************************
     *************************************************************/
    const qrc = template_image_path + circles + reg_no + ".png";
    console.log(reg_no);
    const save_vehicles = new vehicles({
      image: "test",
      zone: zonerow[0].name,
      circle_no: circlerow[0].circle_no,
      circle: circlerow[0].name,
      wards_no: wardsrow[0].wards_no,
      ward_name: wardsrow[0].name,
      location: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
      // incharge: usersrow[0].first_name + '-' + usersrow[0].last_name,
      incharge: sfa_name,
      // incharge_mobile_number: usersrow[0].mobile_number,
      incharge_mobile_number: sfa_mobile,
      vehicle_registration_number: reg_no,
      owner_type_id: owner_type_id,
      owner_type: ownerrow[0].name,
      driver_name: driver_name,
      driver_number: driver_mobile,
      transfer_station:
        transfer_station_row[0].first_name +
        "-" +
        transfer_station_row[0].last_name,
      transfer_station_id: transfer_station_id,
      qr_code_view: qrc,
      unique_no: unique_no,
      tenent_id: zonerow[0].tenent_id,
      zones_id: zone_id,
      circles_id: circle_id,
      ward_id: ward_id,
      landmark_id: land_mark_id,
      vehicle_type_id: vechile_type_id,
      vehicle_type: vehicle_type_row[0].name,
      log_date_modified: "",
      created_by: req.user.user_id
    });
    //area_id:area_id,
    save_vehicles.save((error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        responseObject = {
          success: true,
          login: true,
          message: "Saved successfully"
        };
        res.status(200).json(responseObject);
      }
    });
  } else {
    responseObject = {
      success: false,
      login: true,
      message: "vehicle registerd number  already registered"
    };
    res.status(400).json(responseObject);
  }
};

exports.generate = async (req, res) => {
  const string = Str.random(25);
  const checkstring = await vehicles
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
    cb(null, "./uploads/vehicle/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

exports.upload = multer({
  storage: storage
});
