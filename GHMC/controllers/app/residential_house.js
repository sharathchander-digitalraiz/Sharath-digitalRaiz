const residential_house = require("../../model/residential_house");
const complex_build_two = require("../../model/complex_build2");
const Family_members = require("../../model/family_members");
const unique_nos = require("../../model/unique_nos");
const multer = require("multer");
const zone = require("../../model/zones");
const circle = require("../../model/circles");
const wards = require("../../model/wards");
const landmark = require("../../model/landmarks");
const area = require("../../model/area");
const Str = require("@supercharge/strings");
const QRCode = require("qrcode");
var fs = require("fs");
const mkdirp = require("mkdirp");
const { createCanvas, loadImage, registerFont } = require("canvas");
const residentialHouse_operation = require("../../model/residentialHouse_operation");
const Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;
const Useraccess = require("../../model/useraccess");
const User = require("../../model/users");
const Department = require("../../model/department");

exports.createresidential_house = async (req, res) => {
  console.log(req.body);
  const {
    uuid,
    zones_id,
    circles_id,
    ward_id,
    landmark_id,
    area_id,
    user_id,
    house_address,
    type,
    owner_name,
    owner_mobile,
    owner_aadhar,
    existing_disposal,
    quality_waste,
    wastage_quantity,
    latitude,
    longitude,
    propertyno,
    eighteenabove,
    eighteenbelow
  } = req.body;

  const zonerow = await zone
    .findOne({ _id: zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  //   console.log(zonerow);
  const circlerow = await circle
    .findOne({ _id: circles_id }, { _id: 1, name: 1, circle_no: 1 })
    .exec();
  //  console.log(circlerow);
  const wardrow = await wards
    .findOne({ _id: ward_id }, { _id: 1, name: 1, tenent_id: 1, wards_no: 1 })
    .exec();
  //  console.log(wardrow);
  const landmarkrow = await landmark
    .findOne({ _id: landmark_id }, { _id: 1, landmark_from: 1, landmark_to: 1 })
    .exec();
  //  console.log(landmarkrow);
  const arearow = await area
    .findOne({ _id: area_id }, { _id: 1, name: 1 })
    .exec();
  // console.log(arearow);

  const qr_code_image_path = "uploads/qr-images/residential_house/qr_codes/";
  var template_image_path = "uploads/qr-images/residential_house/templates/";

  var circles = circlerow.name.replace(" ", "-");
  fs.mkdir(qr_code_image_path + circles, function (err) {});
  fs.mkdir(template_image_path + circles, function (err) {});
  var unique_no = await module.exports.generate();

  QRCode.toFile(
    qr_code_image_path + circles + "/" + unique_no + ".png",
    unique_no,
    { version: 10 },
    function (err) {
      loadImage("./resident_house.jpg").then((image) => {
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
      const qr_codes = qr_code_image_path + circles + "/" + unique_no + ".png";
      loadImage(qr_codes).then((image) => {
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(owner_name, 435, 807);

        //  //vehicle type
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(house_address, 435, 865);
        //vehicle registeration no
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(type, 435, 915);
        //  //location
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(landmarkrow.landmark_from, 435, 968);
        //  //ward
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(arearow.name, 435, 1018);
        //  //circle
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(wardrow.name, 435, 1068);
        //  //zone
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(circlerow.name, 435, 1118);

        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(zonerow.name, 435, 1168);

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
  place.coordinates.push(latitude);
  place.coordinates.push(longitude);
  let productPictures = [];
  // console.log(req.files);
  if (req.files.length == 0) {
    return res
      .status(400)
      .json({ success: true, login: true, message: "Image field is required" });
  }
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  console.log(req.body);

  const list = new residential_house({
    uuid: uuid,
    date: dates,
    zone: zonerow.name,
    circle: circlerow.name,
    ward_name: wardrow.name,
    area: arearow.name,
    landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
    type: type,
    house_address: house_address,
    owner_name: owner_name,
    owner_mobile: owner_mobile,
    owner_aadhar: owner_aadhar,
    existing_disposal: existing_disposal,
    quality_waste: quality_waste,
    tenent_id: zonerow.tenent_id,
    zones_id: zones_id,
    circles_id: circles_id,
    ward_id: ward_id,
    landmark_id: landmark_id,
    area_id: area_id,
    user_id: user_id,
    place: place,
    propertyno: propertyno,
    eighteenabove: eighteenabove,
    eighteenbelow: eighteenbelow,
    image: productPictures,
    wastage_quantity: wastage_quantity,
    unique_no: unique_no,
    qr_image: template_image_path + circles + "/" + unique_no + ".png",
    qr_code_view: template_image_path + circles + "/" + unique_no + ".png"
  });

  const unique_noss = new unique_nos({
    unique_no: unique_no,
    user_id: user_id,
    type_db: "residential_houses"
  });

  list.save(async (error, list) => {
    if (error) return res.status(400).json({ error });
    if (list) {
      unique_noss.save();
      const family_mem = await Family_members.find({ uuid: uuid }).exec();
      console.log(family_mem);
      let familys = [];
      familys = family_mem.map((val) => {
        let first_dose =
          val.first_dose_yes_no == undefined ? "" : val.first_dose_yes_no;
        let fir_dose_date =
          val.first_dost_date == undefined ? "" : val.first_dost_date;
        let second_dose =
          val.second_dose_yes_no == undefined ? "" : val.second_dose_yes_no;
        let sec_dose_date =
          val.second_dose_date == undefined ? "" : val.second_dose_date;
        let vaccine_yes_no =
          val.vaccine_yes_no == undefined ? "" : val.vaccine_yes_no;

        return {
          name: val.name,
          gender: val.gender,
          age: val.age,
          mobile: val.mobile,
          aadhar: val.aadhar,
          vaccine_type: val.vaccine_type,
          first_dose_yes_no: first_dose,
          first_dost_date: fir_dose_date,
          second_dose_yes_no: second_dose,
          second_dose_date: sec_dose_date,
          vaccine_yes_no: vaccine_yes_no
        };
      });

      const updateRecords1 = {
        family: familys
      };
      //console.log(updateRecords);

      const cd = await residential_house
        .findOne({ uuid: uuid }, { _id: 1 })
        .exec();
      console.log(cd);
      await residential_house.findByIdAndUpdate(
        { _id: cd._id },
        { ...updateRecords1 },
        (err, data) => {
          //  console.log(data);
          if (err) {
            return res.status(404).json({
              status: false,
              login: true,
              message: "Sorry unable to update residential"
            });
          } else if (data == null) {
            return res
              .status(404)
              .json({ status: false, login: true, message: "Invalid id" });
          } else {
            console.log("hii");
            return res.status(200).json({
              status: true,
              login: true,
              message: "Saved Successfully"
            });
          }
        }
      );
      //  res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }
  });
};

exports.residential_search = async (req, res) => {
  const search = req.body.search;

  const search_data = await residential_house.aggregate([
    { $match: { $text: { $search: search } } },
    {
      $project: {
        _id: 0,
        house_address: 1,
        owner_mobile: 1,
        owner_name: 1,
        uuid: 1
      }
    },
    { $limit: 1 },
    { $sort: { date: -1 } }
  ]);

  if (search_data.length != 0) {
    const family_mem1 = await Family_members.find({
      uuid: search_data[0].uuid
    }).exec();
    search_data[0]["total_members"] = family_mem1.length;
    return res
      .status(200)
      .json({ status: true, data: search_data, message: "success" });
  } else {
    return res
      .status(400)
      .json({ status: false, data: [], message: "No results found" });
  }
};

exports.residential_family_update = async (req, res) => {
  const { uuid } = req.body;
  const family_mem = await Family_members.find({ uuid: uuid }).exec();
  console.log(family_mem);
  let familys = [];
  familys = family_mem.map((val) => {
    let first_dose =
      val.first_dose_yes_no == undefined ? "" : val.first_dose_yes_no;
    let fir_dose_date =
      val.first_dost_date == undefined ? "" : val.first_dost_date;
    let second_dose =
      val.second_dose_yes_no == undefined ? "" : val.second_dose_yes_no;
    let sec_dose_date =
      val.second_dose_date == undefined ? "" : val.second_dose_date;
    let vaccine_yes_no =
      val.vaccine_yes_no == undefined ? "" : val.vaccine_yes_no;

    return {
      name: val.name,
      gender: val.gender,
      age: val.age,
      mobile: val.mobile,
      aadhar: val.aadhar,
      vaccine_type: val.vaccine_type,
      first_dose_yes_no: first_dose,
      first_dost_date: fir_dose_date,
      second_dose_yes_no: second_dose,
      second_dose_date: sec_dose_date,
      vaccine_yes_no: vaccine_yes_no
    };
  });

  const updateRecords1 = {
    family: familys
  };
  //console.log(updateRecords);
  if (!uuid) {
    return res
      .status(400)
      .send({ login: true, status: false, message: "something went wrong" });
  }
  const cd = await residential_house.findOne({ uuid: uuid }, { _id: 1 }).exec();

  await residential_house.findByIdAndUpdate(
    { _id: cd._id },
    { ...updateRecords1 },
    (err, data) => {
      //  console.log(data);
      if (err) {
        return res.status(404).json({
          status: false,
          login: true,
          message: "Sorry unable to update residential"
        });
      } else if (data == null) {
        return res
          .status(404)
          .json({ status: false, login: true, message: "Invalid id" });
      } else {
        return res
          .status(200)
          .json({ status: true, login: true, message: "Added successfully" });
      }
    }
  );
};

exports.del_family_member = async (req, res) => {
  const { uuid } = req.body;
  await Family_members.findOneAndDelete({ uuid: uuid }, (err, data) => {
    if (err) {
      return res.status(404).json({
        status: false,
        login: true,
        message: "Sorry unable to update"
      });
    } else if (data == null) {
      return res
        .status(200)
        .json({ status: true, login: true, message: "Deleted Successfully" });
    } else {
      console.log("update");
      return res
        .status(200)
        .json({ status: true, login: true, message: "Deleted Successfully" });
    }
  });
};

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

exports.generateuuid = async (req, res) => {
  const string = Str.random(25);
  const checkstring = await complex_build_two
    .findOne({ uuid: string }, { _id: 1 })
    .countDocuments();
  const checkstring1 = await residential_house
    .findOne({ uuid: string }, { _id: 1 })
    .countDocuments();
  if (checkstring == 0 || checkstring1 == 0) {
    return string;
  } else {
    module.exports.generate();
  }
};

exports.getuuid = async (req, res) => {
  var uuid = await module.exports.generateuuid();
  return res.status(200).json({ status: true, message: "Success", data: uuid });
};

exports.family_members = async (req, res) => {
  console.log(req.body);
  const {
    user_id,
    uuid,
    gender,
    name,
    age,
    mobile,
    aadhar,
    vaccine_type,
    first_dose_yes_no,
    first_dost_date,
    second_dose_yes_no,
    second_dose_date,
    family_member_no,
    vaccine_yes_no
  } = req.body;
  if (!vaccine_yes_no || vaccine_yes_no == undefined) {
    return res.status(400).send({
      status: false,
      login: true,
      message: "Please select vaccine yes/no"
    });
  }
  if (age != undefined) {
    if (age != "") {
      if (age.length >= 3) {
        return res.status(400).send({
          status: false,
          login: true,
          message: "Age should not be exceed 2 digits"
        });
      }
    }
  }

  if (mobile != undefined) {
    if (mobile != "") {
      var phoneno = /^\d{10}$/;
      if (!mobile.match(phoneno)) {
        return res.status(400).send({
          status: false,
          login: true,
          message: "Mobile no should contain 10 digits"
        });
      }
    }
  }
  if (aadhar != undefined) {
    if (aadhar != "") {
      var aa = /^\d{12}$/;
      if (!aadhar.match(aa)) {
        return res.status(400).send({
          status: false,
          login: true,
          message: "Aadhar number should contain 12 digits"
        });
      }
    }
  }

  if (vaccine_type != "No") {
    if (first_dose_yes_no == "Yes") {
      if (first_dost_date == "" || first_dost_date == undefined) {
        return res
          .status(400)
          .send({ status: false, message: "First dose date is required" });
      }
    }
  }
  if (vaccine_type != "No") {
    if (second_dose_yes_no == "Yes") {
      if (second_dose_date == "" || second_dose_date == undefined) {
        return res
          .status(400)
          .send({ status: false, message: "Second dose date is required" });
      }
    }
  }
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let cd;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  let formatted_date =
    cd +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getFullYear();

  const family_mem_c = await Family_members.findOne({
    family_member_no: family_member_no
  }).countDocuments();
  if (family_mem_c == 0) {
    const family_list = new Family_members({
      user_id: user_id,
      uuid: uuid,
      name: name,
      age: age,
      gender: gender,
      mobile: mobile,
      aadhar: aadhar,
      vaccine_yes_no: vaccine_yes_no,
      vaccine_type: vaccine_type,
      created_by: user_id,
      date: formatted_date,
      family_member_no: family_member_no
    });

    if (first_dose_yes_no == "Yes") {
      family_list["first_dose_yes_no"] = first_dose_yes_no;
      family_list["first_dost_date"] = first_dost_date;
    }
    if (second_dose_yes_no == "Yes") {
      family_list["second_dose_yes_no"] = second_dose_yes_no;
      family_list["second_dose_date"] = second_dose_date;
    }

    if (first_dose_yes_no == "No") {
      family_list["first_dose_yes_no"] = first_dose_yes_no;
      family_list["first_dost_date"] = "";
    }
    if (second_dose_yes_no == "No") {
      family_list["second_dose_yes_no"] = second_dose_yes_no;
      family_list["second_dose_date"] = "";
    }

    family_list.save((error, list) => {
      if (error) return res.status(400).json({ error });
      if (list) {
        console.log("save");
        res
          .status(200)
          .json({ success: true, login: true, message: "Added successfully" });
      }
    });
  } else {
    let family_list_update = {
      user_id: user_id,
      uuid: uuid,
      name: name,
      age: age,
      gender: gender,
      mobile: mobile,
      aadhar: aadhar,
      vaccine_yes_no: vaccine_yes_no,
      vaccine_type: vaccine_type,
      created_by: user_id,
      date: formatted_date,
      family_member_no: family_member_no
    };
    if (first_dose_yes_no == "Yes") {
      family_list_update["first_dose_yes_no"] = first_dose_yes_no;
      family_list_update["first_dost_date"] = first_dost_date;
    }
    if (second_dose_yes_no == "Yes") {
      family_list_update["second_dose_yes_no"] = second_dose_yes_no;
      family_list_update["second_dose_date"] = second_dose_date;
    }

    if (first_dose_yes_no == "No") {
      family_list_update["first_dose_yes_no"] = first_dose_yes_no;
      family_list_update["first_dost_date"] = "";
    }
    if (second_dose_yes_no == "No") {
      family_list_update["second_dose_yes_no"] = second_dose_yes_no;
      family_list_update["second_dose_date"] = "";
    }
    await Family_members.findOneAndUpdate(
      { family_member_no: family_member_no },
      { ...family_list_update },
      (err, data) => {
        if (err) {
          return res.status(404).json({
            status: false,
            login: true,
            message: "Sorry unable to update"
          });
        } else if (data == null) {
          return res
            .status(404)
            .json({ status: false, login: true, message: "Invalid " });
        } else {
          console.log("update");
          return res
            .status(200)
            .json({ status: true, login: true, message: "Added Successfully" });
        }
      }
    );
  }
};

exports.getallresidentialhouse = async (req, res) => {
  const alldata = await residential_house.find({ status: "Active" }).exec();
  return res.status(200).json({ status: true, data: alldata });
};

exports.editresidential_house = async (req, res) => {
  const id = req.body.id;
  await residential_house.findOne({ _id: id }, (err, data) => {
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Residential data not exists" });
    } else {
      return res.status(200).json({ status: true, data });
    }
  });
};

exports.updateresidential_house = async (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const {
    zones_id,
    circles_id,
    ward_id,
    landmark_id,
    area_id,
    user_id,
    house_address,
    type,
    owner_name,
    owner_mobile,
    owner_aadhar,
    existing_disposal,
    quality_waste,
    wastage_quantity,
    latitude,
    longitude
  } = req.body;
  if (!id) {
    return res
      .status(404)
      .json({ status: false, message: "Residential id is required" });
  }

  const zonerow = await zone
    .findOne({ _id: zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  console.log(zonerow);
  const circlerow = await circle
    .findOne({ _id: req.body.circles_id }, { _id: 1, name: 1, circle_no: 1 })
    .exec();
  const wardrow = await wards
    .findOne(
      { _id: req.body.ward_id },
      { _id: 1, name: 1, tenent_id: 1, wards_no: 1 }
    )
    .exec();
  const landmarkrow = await landmark
    .findOne(
      { _id: req.body.landmark_id },
      { _id: 1, landmark_from: 1, landmark_to: 1 }
    )
    .exec();
  const arearow = await area
    .findOne({ _id: req.body.area_id }, { _id: 1, name: 1 })
    .exec();
  let productPictures = [];
  //console.log(req.files);
  if (req.files.length > 0) {
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.filename };
      });
    }
  } else {
    var compleximg = await residential_house
      .findOne({ _id: id }, { image: 1 })
      .exec();
    console.log(compleximg);
    productPictures = compleximg.image;
  }
  const qr_code_image_path = "images/qr-images/residential_house/qr_codes/";
  var template_image_path = "images/qr-images/residential_house/templates/";
  const unique_nos = await residential_house
    .findOne({ _id: id }, { unique_no: 1 })
    .exec();
  var circles = circlerow.name.replace(" ", "-");
  fs.mkdir(qr_code_image_path + circles, function (err) {});
  fs.mkdir(template_image_path + circles, function (err) {});
  var unique_no = unique_nos.unique_no;

  QRCode.toFile(
    qr_code_image_path + circles + "/" + unique_no + ".png",
    unique_no,
    { version: 10 },
    function (err) {
      loadImage("./resident_house.jpg").then((image) => {
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
      const qr_codes = qr_code_image_path + circles + "/" + unique_no + ".png";
      loadImage(qr_codes).then((image) => {
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(owner_name, 435, 807);

        //  //vehicle type
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(house_address, 435, 865);
        //vehicle registeration no
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(type, 435, 915);
        //  //location
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(landmarkrow.landmark_from, 435, 968);
        //  //ward
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(arearow.name, 435, 1018);
        //  //circle
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(wardrow.name, 435, 1068);
        //  //zone
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(circlerow.name, 435, 1118);

        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(zonerow.name, 435, 1168);

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
  const place = {};
  place.type = "Point";
  place.coordinates = [];
  place.coordinates.push(req.body.latitude);
  place.coordinates.push(req.body.longitude);
  const updateRecords = {
    ...req.body,
    image: productPictures,
    place: place,
    zones_id: req.body.zones_id,
    circles_id: req.body.circles_id,
    ward_id: req.body.ward_id,
    landmark_id: req.body.landmark_id,
    area_id: req.body.area_id,
    zone: zonerow.name,
    circle_no: circlerow.circle_no,
    circle: circlerow.name,
    wards_no: wardrow.wards_no,
    ward_name: wardrow.name,
    area: arearow.name,
    landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
    user_id: req.user.user_id,
    modified_by: req.user.user_id,
    log_date_modified: new Date(),
    unique_no: unique_no,
    qr_image: template_image_path + circles + "/" + unique_no + ".png",
    qr_code_view: template_image_path + circles + "/" + unique_no + ".png"
  };

  await residential_house.findByIdAndUpdate(
    { _id: id },
    { ...updateRecords },
    (err, data) => {
      //  console.log(data);
      if (err) {
        return res.status(404).json({
          status: false,
          message: "Sorry unable to update residential"
        });
      } else if (data == null) {
        return res.status(404).json({ status: false, message: "Invalid id" });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Updated Successfully" });
      }
    }
  );
};

exports.get_all_family = async (req, res) => {
  const uuid = req.body.uuid;
  const search_data = await Family_members.aggregate([
    { $match: { uuid: uuid } },
    {
      $project: {
        user_id: 1,
        uuid: 1,
        fullname: "$name",
        age: 1,
        gender: 1,
        mobile: 1,
        aadhar: 1,
        vaccine_yes_no: 1,
        created_by: 1,
        vaccine_type: 1,
        date: 1,
        family_member_no: 1,
        first_dose_yes_no: 1,
        first_dost_date: 1,
        second_dose_yes_no: 1,
        second_dose_date: 1
      }
    }
  ]);

  console.log(search_data);

  const finalarray = [];
  search_data.map((val) => {
    let oj = {};
    oj["user_id"] = val.user_id ? val.user_id : "";
    oj["uuid"] = val.uuid ? val.uuid : "";
    oj["name"] = val.fullname ? val.fullname : "";
    oj["age"] = val.age ? val.age : "";
    oj["gender"] = val.gender ? val.gender : "";
    oj["mobile"] = val.mobile ? val.mobile : "";
    oj["aadhar"] = val.aadhar ? val.aadhar : "";
    oj["vaccine_yes_no"] = val.vaccine_yes_no ? val.vaccine_yes_no : "";
    oj["created_by"] = val.created_by ? val.created_by : "";
    oj["date"] = val.date ? val.date : "";
    oj["family_member_no"] = val.family_member_no ? val.family_member_no : "";
    oj["first_dose_yes_no"] = val.first_dose_yes_no
      ? val.first_dose_yes_no
      : "";
    oj["first_dost_date"] = val.first_dost_date ? val.first_dost_date : "";
    oj["second_dose_yes_no"] = val.second_dose_yes_no
      ? val.second_dose_yes_no
      : "";
    oj["second_dose_date"] = val.second_dose_date ? val.second_dose_date : "";
    oj["vaccine_type"] = val.vaccine_type ? val.vaccine_type : "";
    finalarray.push(oj);
  });
  return res
    .status(200)
    .json({ status: true, data: finalarray, uuid: uuid, message: "success" });
  //  return res.status(200).json({status:true,data:search_data,uuid:uuid ,message:'success'});
};

exports.deleteresidential_house = async (req, res) => {
  const _id = req.body.id;
  // console.log(id);
  const updateRecords = {
    status: "In-active"
  };
  await residential_house.findByIdAndUpdate(
    { _id },
    { ...updateRecords },
    (err, data) => {
      //  console.log(data);
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to delete " });
      } else if (data == null) {
        return res
          .status(404)
          .json({ status: false, message: "No records found to delete" });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Deleted Successfully" });
      }
    }
  );
};

exports.residential_details = async (req, res) => {
  const uuid = req.body.uuid;
  const resi_details = await residential_house.aggregate([
    {
      $match: { uuid: uuid }
    },
    {
      $lookup: {
        from: "zones",
        localField: "zones_id",
        foreignField: "_id",
        as: "zones_info"
      }
    },
    { $unwind: "$zones_info" },
    {
      $lookup: {
        from: "circles",
        localField: "circles_id",
        foreignField: "_id",
        as: "circle_info"
      }
    },
    { $unwind: "$circle_info" },
    {
      $lookup: {
        from: "wards",
        localField: "ward_id",
        foreignField: "_id",
        as: "wards_info"
      }
    },
    { $unwind: "$wards_info" },
    {
      $lookup: {
        from: "areas",
        localField: "area_id",
        foreignField: "_id",
        as: "areas_info"
      }
    },
    { $unwind: "$areas_info" },
    {
      $lookup: {
        from: "landmarks",
        localField: "landmark_id",
        foreignField: "_id",
        as: "landmark_info"
      }
    },
    { $unwind: "$landmark_info" },
    {
      $project: {
        _id: 1,
        zone_name: "$zones_info.name",
        circle_name: "$circle_info.name",
        wardname: { $concat: ["$wards_info.name"] },
        area_name: "$areas_info.name",
        landmark_name: {
          $concat: [
            "$landmark_info.landmark_from",
            " - ",
            "$landmark_info.landmark_to"
          ]
        },
        owner_name: 1
      }
    }
  ]);
  return res
    .status(200)
    .json({ status: true, data: resi_details, message: "success" });
};

exports.alldropdowns = (req, res) => {
  finaldata = {};
  finaldata.business_type = [
    {
      name: "Kirana shop"
    },
    {
      name: "Medical shop"
    },
    {
      name: "Education"
    },
    {
      name: "Auto mobiles"
    }
  ];
  finaldata.category_type = [
    {
      name: "Business"
    },
    {
      name: "Residencial"
    }
  ];
  finaldata.licence = [
    {
      licence: "Perminent"
    },
    {
      licence: "Temporary"
    },
    {
      licence: "No"
    }
  ];
  finaldata.existing_disposal = [
    {
      disposal: "Dry"
    },
    {
      disposal: "Wet"
    },
    {
      disposal: "Dry & Wet"
    },
    {
      disposal: "Other"
    }
  ];
  finaldata.quality_waste = [
    {
      waste: "Killos"
    },
    {
      waste: "Tones"
    }
  ];
  finaldata.type_of_house = [
    {
      type: "Pacca"
    },
    {
      type: "Semi pacca"
    },
    {
      type: "Kaccha"
    }
  ];
  finaldata.type_of_manhole = [
    {
      name: "Man hole"
    },
    {
      name: "Tree"
    },
    {
      name: "Bus stop"
    }
  ];
  finaldata.manhole_type = [
    {
      name: "Minor"
    },
    {
      name: "Major"
    }
  ];
  finaldata.type_of_details = [
    {
      name: "Temple"
    },
    {
      name: "Majid"
    },
    {
      name: "Church"
    },
    {
      name: "Yard"
    },
    {
      name: "Water Tank"
    },
    {
      name: "Government Property"
    }
  ];
  finaldata.community_type = [
    {
      name: "Commercial Establishment"
    },
    {
      name: "Community Hall"
    }
  ];

  finaldata.toilets_scan_type = [
    {
      name: "Cleaning"
    },
    {
      name: "Picking Garbage"
    }
  ];
  finaldata.toilets_scan_reason = [
    {
      name: "Cleaned"
    },
    {
      name: "Water not available"
    },
    {
      name: "Damages"
    }
  ];
  return res.status(200).json({ login: true, status: true, data: finaldata });
};

exports.admincreateresidential_house = async (req, res) => {
  const {
    zones_id,
    circles_id,
    ward_id,
    landmark_id,
    area_id,
    user_id,
    house_address,
    type,
    owner_name,
    owner_mobile,
    owner_aadhar,
    existing_disposal,
    quality_waste,
    wastage_quantity,
    latitude,
    longitude,
    propertyno,
    eighteenabove,
    eighteenbelow,
    family_mem
  } = req.body;
  const uuid = await module.exports.generate();
  const zonerow = await zone
    .findOne({ _id: zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  //   console.log(zonerow);
  const circlerow = await circle
    .findOne({ _id: circles_id }, { _id: 1, name: 1, circle_no: 1 })
    .exec();
  //  console.log(circlerow);
  const wardrow = await wards
    .findOne({ _id: ward_id }, { _id: 1, name: 1, tenent_id: 1, wards_no: 1 })
    .exec();
  //  console.log(wardrow);
  const landmarkrow = await landmark
    .findOne({ _id: landmark_id }, { _id: 1, landmark_from: 1, landmark_to: 1 })
    .exec();
  //  console.log(landmarkrow);
  const arearow = await area
    .findOne({ _id: area_id }, { _id: 1, name: 1 })
    .exec();
  // console.log(arearow);

  const qr_code_image_path = "uploads/qr-images/residential_house/qr_codes/";
  var template_image_path = "uploads/qr-images/residential_house/templates/";

  var circles = circlerow.name.replace(" ", "-");
  fs.mkdir(qr_code_image_path + circles, function (err) {});
  fs.mkdir(template_image_path + circles, function (err) {});
  var unique_no = await module.exports.generate();
  console.log(req.user);

  QRCode.toFile(
    qr_code_image_path + circles + "/" + unique_no + ".png",
    unique_no,
    { version: 10 },
    function (err) {
      loadImage("./resident_house.jpg").then((image) => {
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
      const qr_codes = qr_code_image_path + circles + "/" + unique_no + ".png";
      loadImage(qr_codes).then((image) => {
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(owner_name, 435, 807);

        //  //vehicle type
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(house_address, 435, 865);
        //vehicle registeration no
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(type, 435, 915);
        //  //location
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(landmarkrow.landmark_from, 435, 968);
        //  //ward
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(arearow.name, 435, 1018);
        //  //circle
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(wardrow.name, 435, 1068);
        //  //zone
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(circlerow.name, 435, 1118);

        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(zonerow.name, 435, 1168);

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
  place.coordinates.push(latitude);
  place.coordinates.push(longitude);
  let productPictures = [];
  // console.log(req.files);
  if (req.files.length == 0) {
    return res
      .status(400)
      .json({ success: true, login: true, message: "Image field is required" });
  }
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  console.log(uuid);
  const list = new residential_house({
    uuid: uuid,
    date: dates,
    zone: zonerow.name,
    circle: circlerow.name,
    ward_name: wardrow.name,
    area: arearow.name,
    landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
    type: type,
    house_address: house_address,
    owner_name: owner_name,
    owner_mobile: owner_mobile,
    owner_aadhar: owner_aadhar,
    existing_disposal: existing_disposal,
    quality_waste: quality_waste,
    tenent_id: zonerow.tenent_id,
    zones_id: zones_id,
    circles_id: circles_id,
    ward_id: ward_id,
    landmark_id: landmark_id,
    area_id: area_id,
    user_id: user_id,
    place: place,
    propertyno: propertyno,
    eighteenabove: eighteenabove,
    eighteenbelow: eighteenbelow,
    family: family_mem.map((val) => {
      return JSON.parse(val);
    }),
    image: productPictures,
    wastage_quantity: wastage_quantity,
    unique_no: unique_no,
    qr_image: template_image_path + circles + "/" + unique_no + ".png",
    qr_code_view: template_image_path + circles + "/" + unique_no + ".png",
    created_by: req.user.user_id
  });

  const unique_noss = new unique_nos({
    unique_no: unique_no,
    user_id: user_id,
    type_db: "residential_houses"
  });

  list.save(async (error, list) => {
    if (error) return res.status(400).json({ error });
    if (list) {
      unique_noss.save();

      // console.log(family_mem);
      // let familys = [];
      // familys = family_mem.map((val) => {
      //   return {
      //     name: val.name,
      //     gender: val.gender,
      //     age: val.age,
      //     mobile: val.mobile,
      //     aadhar: val.aadhar,
      //     vaccine_type: val.vaccine_type,
      //     first_dose_yes_no: val.first_dose_yes_no,
      //     first_dost_date: val.first_dost_date,
      //     user_id: user_id,
      //     second_dose_yes_no: val.second_dose,
      //     second_dose_date: val.sec_dose_date,
      //     vaccine_yes_no: val.vaccine_yes_no,
      //     created_by: req.user.user_id,
      //     uuid: uuid
      //   };
      // });

      // const options = { ordered: true };
      // const result = await Family_members.insertMany(familys, options);

      // const cd = await residential_house
      //   .findOne({ uuid: uuid }, { _id: 1 })
      //   .exec();
      // console.log(cd);
      // const houseResult = await residential_house.updateOne(
      //   { _id: cd._id },
      //   { $set: { ...family_mem } },
      //   { new: true }
      // );
      // if (houseResult) {
      return res.status(200).json({
        status: true,
        login: true,
        message: "Saved Successfully"
      });
      // }
      //  res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }
  });
};

/**********************************************************************************************************************
 * **************************************RESIDENTIAL HOUSE UPDATE********************************************************
 * *************************************************************************************************************************/

exports.adminupdateresidential_house = async (req, res) => {
  const {
    id,
    zones_id,
    circles_id,
    ward_id,
    landmark_id,
    area_id,
    user_id,
    house_address,
    type,
    owner_name,
    owner_mobile,
    owner_aadhar,
    existing_disposal,
    quality_waste,
    wastage_quantity,
    latitude,
    longitude,
    propertyno,
    eighteenabove,
    eighteenbelow,
    family_mem
  } = req.body;
  const uuid = await module.exports.generate();
  const residentialHouseData = await residential_house
    .findOne({ _id: id }, {})
    .exec();
  const zonerow = await zone
    .findOne({ _id: zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  //   console.log(zonerow);
  const circlerow = await circle
    .findOne({ _id: circles_id }, { _id: 1, name: 1, circle_no: 1 })
    .exec();
  //  console.log(circlerow);
  const wardrow = await wards
    .findOne({ _id: ward_id }, { _id: 1, name: 1, tenent_id: 1, wards_no: 1 })
    .exec();
  //  console.log(wardrow);
  const landmarkrow = await landmark
    .findOne({ _id: landmark_id }, { _id: 1, landmark_from: 1, landmark_to: 1 })
    .exec();
  //  console.log(landmarkrow);
  const arearow = await area
    .findOne({ _id: area_id }, { _id: 1, name: 1 })
    .exec();
  // console.log(arearow);

  const qr_code_image_path = "uploads/qr-images/residential_house/qr_codes/";
  var template_image_path = "uploads/qr-images/residential_house/templates/";

  var circles = circlerow.name.replace(" ", "-");
  fs.mkdir(qr_code_image_path + circles, function (err) {});
  fs.mkdir(template_image_path + circles, function (err) {});
  var unique_no = residentialHouseData.unique_no;
  console.log(req.user);

  QRCode.toFile(
    qr_code_image_path + circles + "/" + unique_no + ".png",
    unique_no,
    { version: 10 },
    function (err) {
      loadImage("./resident_house.jpg").then((image) => {
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
      const qr_codes = qr_code_image_path + circles + "/" + unique_no + ".png";
      loadImage(qr_codes).then((image) => {
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(owner_name, 435, 807);

        //  //vehicle type
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(house_address, 435, 865);
        //vehicle registeration no
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(type, 435, 915);
        //  //location
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(landmarkrow.landmark_from, 435, 968);
        //  //ward
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(arearow.name, 435, 1018);
        //  //circle
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(wardrow.name, 435, 1068);
        //  //zone
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(circlerow.name, 435, 1118);

        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(zonerow.name, 435, 1168);

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
  place.coordinates.push(latitude);
  place.coordinates.push(longitude);
  let productPictures = [];
  // console.log(req.files);
  if (req.files.length == 0) {
    return res
      .status(400)
      .json({ success: true, login: true, message: "Image field is required" });
  }
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  console.log(uuid);
  const list = await residential_house.updateOne(
    { _id: id },
    {
      date: dates,
      zone: zonerow.name,
      circle: circlerow.name,
      ward_name: wardrow.name,
      area: arearow.name,
      landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
      type: type,
      house_address: house_address,
      owner_name: owner_name,
      owner_mobile: owner_mobile,
      owner_aadhar: owner_aadhar,
      existing_disposal: existing_disposal,
      quality_waste: quality_waste,
      tenent_id: zonerow.tenent_id,
      zones_id: zones_id,
      circles_id: circles_id,
      ward_id: ward_id,
      landmark_id: landmark_id,
      area_id: area_id,
      user_id: user_id,
      place: place,
      propertyno: propertyno,
      eighteenabove: eighteenabove,
      eighteenbelow: eighteenbelow,
      image: productPictures,
      wastage_quantity: wastage_quantity,
      unique_no: unique_no,
      qr_image: template_image_path + circles + "/" + unique_no + ".png",
      qr_code_view: template_image_path + circles + "/" + unique_no + ".png",
      modified_by: req.user.user_id
    },
    async (err, data) => {
      if (err) {
        responseObject = {
          success: false,
          login: true,
          message: "Something went wrong please try again"
        };
        res.status(400).json(responseObject);
      } else if (data == null) {
        responseObject = {
          success: false,
          login: true,
          message: "Sorry unable to update Vehicle"
        };
        res.status(400).json(responseObject);
      } else if (data) {
        /******************************************************************************************************
         ****************************Family membbers Delete & Update*********************************************
         *********************************************************************************************************  */

        const delete_members = await Family_members.deleteMany({ uuid: uuid });
        let familys = [];
        familys = family_mem.map((val) => {
          return {
            name: val.name,
            gender: val.gender,
            age: val.age,
            mobile: val.mobile,
            aadhar: val.aadhar,
            vaccine_type: val.vaccine_type,
            first_dose_yes_no: val.first_dose_yes_no,
            first_dost_date: val.first_dost_date,
            user_id: user_id,
            second_dose_yes_no: val.second_dose,
            second_dose_date: val.sec_dose_date,
            vaccine_yes_no: val.vaccine_yes_no,
            created_by: req.user.user_id,
            uuid: uuid
          };
        });
        console.log(family_mem);
        const options = { ordered: true };
        const result = await Family_members.insertMany(familys, options);
        const cd = await residential_house
          .findOne({ uuid: uuid }, { _id: 1 })
          .exec();
        console.log(cd);
        await residential_house.findByIdAndUpdate(
          { _id: cd._id },
          { ...family_mem },
          (err, data) => {}
        );
        /**************************************************************************************************************************
         * ****************************************END FAMILY MEMBERS UPDATE********************************************************
         * ***************************************************************************************************************************/
        responseObject = {
          success: true,
          login: true,
          message: "Updated Successfully"
        };
        res.status(200).json(responseObject);
      }
    }
  );
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/residential_house/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

exports.upload_residential_house = multer({ storage: storage });

// residential house scan cron job
exports.residentialHouse_cronjob = async function (req, res) {
  try {
    const showResidentialHouse = await residential_house.find({}, {});
    let dateTime = new Date();
    let d = new String(dateTime.getDate());
    let m = new String(dateTime.getMonth() + 1);

    let todayDate;
    let thisMonth;

    if (d.length == 1) {
      todayDate = "0" + d;
    } else {
      todayDate = dateTime.getDate();
    }

    if (m.length == 1) {
      thisMonth = "0" + m;
    } else {
      thisMonth = dateTime.getMonth() + 1;
    }

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;
    console.log(formattedDate);
    /*
    create a folder  based on dates
    */
    // mkdirp('./uploads/operations/'+formattedDate, function(err) {});

    showResidentialHouse.forEach(async function (item) {
      let copyDocuments = {
        date: formattedDate,
        uuid: item.uuid,
        zones_id: item.zones_id,
        zone: item.zone,
        circles_id: item.circles_id,
        circle: item.circle,
        ward_id: item.ward_id,
        ward_name: item.ward_name,
        area_id: item.area_id,
        area: item.area,
        landmark_id: item.landmark_id,
        landmark: item.landmark,
        type: item.type,
        house_address: item.house_address,
        eighteenabove: item.eighteenabove,
        eighteenbelow: item.eighteenbelow,
        property_no: item.propertyno,
        owner_name: item.owner_name,
        owner_mobile: item.owner_mobile,
        owner_aadhar: item.owner_aadhar,
        collection_id: item._id,
        tenent_id: item.tenent_id,
        status: item.status,
        user_id: null,
        approx_weight: "",
        picked_denied: "0",
        wt_type: "",
        db_type: "residential_houses",
        attend: "0",
        reason: "",
        image: [],
        created_by: null,
        log_date_created: null,
        modified_by: null,
        log_date_modified: null
      };
      let result = await residentialHouse_operation(copyDocuments).save();
    });
    res
      .status(200)
      .json({ message: "residential house operations saved successfully" });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

exports.residential_report_search = async (req, res) => {
  const {
    user_id,
    zones_id,
    circles_id,
    ward_id,
    areas_id,
    tenent_id,
    status,
    date1,
    date2
  } = req.body;
  let acc_dep_data = await User.findOne(
    { _id: user_id },
    { department_id: 1, user_access_id: 1 }
  ).exec();
  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );
  let newobject = {};
  let issueObject = {};
  var dates = [];
  var type = "";
  var circles = [];
  var head = [];

  newobject.tenent_id = tenent_id;
  issueObject.tenent_id = tenent_id;

  head.push(
    "zone",
    "circle",
    "ward",
    "area",
    "landmark",
    "type",
    "name",
    "address"
  );
  console.log(role_data.name);
  if (date2 != date1) {
    dates = await getDateRange(new Date(date1), new Date(date2));
    await Promise.all(
      dates.map(async (da, l) => {
        const datse = new Date(da)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "")
          .substr(0, 10);
        head.push(datse);
      })
    );
    // dates=datse.sort();
  } else {
    head.push("date", "image", "picked_denied", "weight", "reason");
  }
  if (zones_id != "" && zones_id != undefined && zones_id != "All") {
    newobject["zones_id"] = ObjectId(zones_id);
    issueObject["zones_id"] = ObjectId(zones_id);
  } else {
    if (role_data.name != "Admin") {
      const access_data = await Useraccess.findOne({
        _id: acc_dep_data.user_access_id
      }).exec();
      var zones = access_data["zones"].map((val) => {
        return ObjectId(val);
      });
      newobject.zones_id = { $in: zones };
      issueObject.zones_id = { $in: zones };
    }
  }

  if (circles_id != "" && circles_id != undefined && circles_id != "All") {
    newobject["circles_id"] = ObjectId(circles_id);
    issueObject["circles_id"] = ObjectId(circles_id);
  } else {
    if (role_data.name != "Admin") {
      const access_data = await Useraccess.findOne({
        _id: acc_dep_data.user_access_id
      }).exec();
      access_data["circles"].forEach(function (item) {
        circles.push(ObjectId(item));
      });
      newobject.circles_id = { $in: circles };
      issueObject.circles_id = { $in: circles };
    }
  }
  if (ward_id != "" && ward_id != undefined && ward_id != "All") {
    newobject["ward_id"] = ObjectId(ward_id);
    issueObject["ward_id"] = ObjectId(ward_id);
  } else {
    if (role_data.name != "Admin") {
      const access_data = await Useraccess.findOne({
        _id: acc_dep_data.user_access_id
      }).exec();
      var ward = access_data["ward"].map((val) => {
        return ObjectId(val);
      });
      newobject.ward_id = { $in: ward };
      issueObject.ward_id = { $in: ward };
    }
  }
  if (areas_id != "" && areas_id != undefined && areas_id != "All") {
    newobject["area_id"] = ObjectId(areas_id);
    issueObject["area_id"] = ObjectId(areas_id);
  } else {
    if (role_data.name != "Admin") {
      const access_data = await Useraccess.findOne({
        _id: acc_dep_data.user_access_id
      }).exec();
      var areas = access_data["areas"].map((val) => {
        return ObjectId(val);
      });
      newobject.area_id = { $in: areas };
      issueObject.area_id = { $in: areas };
    }
  }

  let userToken = "";
  if (date1 == date2) {
    type = "today";
  } else {
    type = "days";
  }

  if (status != "All") {
    issueObject.attend = status;
  }
  //  if(Mtype!="All")
  //  {
  //   issueObject.type=Mtype;
  //  }

  console.log(status);
  userToken = await alldata(issueObject, date1, date2, dates);
  res.status(200).send({
    login: true,
    status: true,
    result: userToken,
    type: type,
    headers: head
  });
};

async function alldata(issueObject, date1, date2, dates) {
  console.log(issueObject);
  const dbData = await residentialHouse_operation
    .find(issueObject)
    .sort({ name: -1 })
    .exec();
  async function processculvert_issue(data) {
    let finaldata = [];
    await Promise.all(
      dbData.map(async (val, i) => {
        console.log(val);
        let obj = {
          zone: val.zone,
          circle: val.circle,
          ward: val.ward_name,
          area: val.area,
          landmark: val.landmark,
          type: val.type,
          owner_name: val.owner_name ? val.owner_name : "-",
          address: val.house_address ? val.house_address : "-"
        };
        if (date1 == date2) {
          switch (val.attend) {
            case "0":
              obj["date"] = date2;
              obj["image"] = [];
              obj["picked_denied"] = "-";
              obj["weight"] = "-";
              obj["reason"] = "-";
              break;
            case "1":
              obj["date"] = date2;
              obj["image"] = val.image;
              obj["picked_denied"] = val.picked_denied == "0" ? "Yes" : "No";
              obj["weight"] = val.weight ? val.weight : "-";
              obj["reason"] = val.reason ? val.reason : "-";
              break;
            default:
              obj["date"] = date2;
              obj["image"] = [];
              obj["picked_denied"] = "-";
              obj["weight"] = "-";
              obj["reason"] = "-";
          }
          obj["data"] = [];
        } else {
          obj["data"] = [];
          obj["image"] = [];
          await Promise.all(
            dates.map(async (da, l) => {
              var df = new Date(da)
                .toISOString()
                .replace(/T/, " ")
                .replace(/\..+/, "")
                .substr(0, 10);
              var oj = {
                date: df,
                attend: 0
              };
              var doc = await residentialHouse_operation
                .findOne({ collection_id: val.collection_id, date: df }, {})
                .exec();
              //  console.log(doc);
              if (doc != "" && doc != null) {
                oj.attend = doc.attend;
              } else {
                oj.attend = "-";
              }

              console.log(oj);
              obj["data"].push(oj);
              await obj["data"].sort(compare);
            })
          );
        }

        finaldata.push(obj);
      })
    );
    return finaldata;
  }
  return processculvert_issue(1);
}

function getDateRange(startDate, endDate, addFn, interval) {
  addFn = addFn || Date.prototype.addDays;
  interval = interval || 1;
  var dates = [];
  var date = new Date(startDate);
  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

function compare(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}
