const complex_build_two = require("../../model/complex_build2");
const residential_house = require("../../model/residential_house");
const Family_members = require("../../model/family_members");
const unique_nos = require("../../model/unique_nos");
const complex_building = require("../../model/complex_building");

const multer = require("multer");
const Str = require("@supercharge/strings");
const QRCode = require("qrcode");
var fs = require("fs");
const mkdirp = require("mkdirp");
const { createCanvas, loadImage, registerFont } = require("canvas");
const zone = require("../../model/zones");
const circle = require("../../model/circles");
const wards = require("../../model/wards");
const landmark = require("../../model/landmarks");
const area = require("../../model/area");

exports.createcomplex_build_two = async (req, res) => {
  console.log(req.body);
  let {
    uuid,
    complex_id,
    floor,
    floor_no,
    category,
    business_type,
    business_name,
    shop_address,
    owner_name,
    owner_mobile,
    owner_aadhar,
    licence_number,
    existing_disposal,
    approx_quality_waste,
    user_id,
    status,
    log_date_created,
    log_date_modified,
    modified_by,
    latitude,
    longitude,
    wastage_quantity,
    resident_type,
    propertyno,
    eighteenabove,
    eighteenbelow,
    licence_no
  } = req.body;

  const comp_details = await complex_building
    .findOne({ _id: complex_id })
    .exec();
  console.log(comp_details);
  const zonerow = await zone
    .findOne({ _id: comp_details.zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();

  const circlerow = await circle
    .findOne(
      { _id: comp_details.circles_id },
      { _id: 1, name: 1, circle_no: 1 }
    )
    .exec();

  const wardrow = await wards
    .findOne(
      { _id: comp_details.ward_id },
      { _id: 1, name: 1, tenent_id: 1, wards_no: 1 }
    )
    .exec();

  const landmarkrow = await landmark
    .findOne(
      { _id: comp_details.landmark_id },
      { _id: 1, landmark_from: 1, landmark_to: 1 }
    )
    .exec();

  const arearow = await area
    .findOne({ _id: comp_details.area_id }, { _id: 1, name: 1 })
    .exec();
  console.log(circlerow);
  if (category == "Business") {
    if (!business_type) {
      return res
        .status(400)
        .json({
          success: false,
          login: true,
          message: "Please select business type"
        });
    }
    if (!business_name) {
      return res
        .status(400)
        .json({
          success: false,
          login: true,
          message: "Please enter business name"
        });
    }
    if (!licence_number) {
      return res
        .status(400)
        .json({
          success: false,
          login: true,
          message: "Please select license"
        });
    }
  } else if (category == "Residencial") {
    if (!resident_type) {
      return res
        .status(400)
        .json({
          success: false,
          login: true,
          message: "Please select resident type"
        });
    }
  }

  const qr_code_image_path = "uploads/qr-images/complex_building_two/qr_codes/";
  var template_image_path = "uploads/qr-images/complex_building_two/templates/";

  var circles = circlerow.name.replace(" ", "-");
  fs.mkdir(qr_code_image_path + circles, function (err) {});
  fs.mkdir(template_image_path + circles, function (err) {});
  var unique_no = await module.exports.generate();
  QRCode.toFile(
    qr_code_image_path + circles + "/" + unique_no + ".png",
    unique_no,
    { version: 10 },
    function (err) {
      loadImage("./complex_build_two.jpg").then((image) => {
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
        context.fillText(business_name, 435, 807);

        //  //vehicle type
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(category, 435, 865);
        //vehicle registeration no
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(comp_details.name, 435, 915);
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

  if (uuid == "") {
    uuid = "11111111";
  }

  let productPictures = [];
  // console.log(req.files);
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  const place = {};
  place.type = "Point";
  place.coordinates = [];
  place.coordinates.push(latitude);
  place.coordinates.push(longitude);
  const list = new complex_build_two({
    uuid: uuid,
    licence_no: licence_no,
    complex_id: complex_id,
    floor: floor,
    floor_no: floor_no,
    category: category,
    business_type: business_type,
    business_name: business_name,
    shop_address: shop_address,
    owner_name: owner_name,
    owner_mobile: owner_mobile,
    owner_aadhar: owner_aadhar,
    licence_number: licence_number,
    existing_disposal: existing_disposal,
    approx_quality_waste: approx_quality_waste,
    user_id: user_id,
    created_by: user_id,
    log_date_created: log_date_created,
    log_date_modified: log_date_modified,
    modified_by: modified_by,
    status: status,
    place: place,
    eighteenbelow: eighteenbelow,
    propertyno: propertyno,
    eighteenabove: eighteenabove,
    wastage_quantity: wastage_quantity,
    resident_type: resident_type,
    unique_no: unique_no,
    qr_image: template_image_path + circles + "/" + unique_no + ".png",
    qr_code_view: template_image_path + circles + "/" + unique_no + ".png",
    image: productPictures
  });
  const unique_noss = new unique_nos({
    unique_no: unique_no,
    user_id: user_id,
    type_db: "comercial_flats"
  });
  const exists = await complex_build_two
    .findOne({ floor: floor, floor_no: floor_no })
    .countDocuments();
  //console.log(exists);
  if (!exists) {
    list.save(async (error, list) => {
      if (error) return res.status(400).json({ error });
      if (list) {
        unique_noss.save();
        console.log("building");
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

        const cd = await complex_build_two
          .findOne({ uuid: uuid }, { _id: 1 })
          .exec();
        console.log(cd);
        await complex_build_two.findByIdAndUpdate(
          { _id: cd._id },
          { ...updateRecords1 },
          (err, data) => {
            //  console.log(data);
            if (err) {
              return res
                .status(404)
                .json({
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
              return res
                .status(200)
                .json({
                  status: true,
                  login: true,
                  message: "Added Successfully"
                });
            }
          }
        );
        //  res.status(200).json({success: true, login: true, message: 'Saved successfully' });
      }
    });
  } else {
    res
      .status(200)
      .json({
        success: true,
        login: true,
        message: "Sorry floor and floor details already exists"
      });
  }
};

exports.generate = async (req, res) => {
  const string = Str.random(25);
  const checkstring = await complex_build_two
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

exports.getuuid_complex = async (req, res) => {
  var uuid = await module.exports.generateuuid();
  return res.status(200).json({ status: true, data: uuid });
};

exports.complexbusiness_type = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Successfully completed",
    data: [
      {
        name: "Business"
      },
      {
        name: "Residencial"
      }
    ]
  });
};

exports.getallcomplexbuildingtwo = async (req, res) => {
  const alldata = await complex_build_two.find({}).exec();
  return res.status(404).json({ status: true, data: alldata });
};

exports.deletecomplexbuildingtwo = async (req, res) => {
  id = req.body.id;
  await complex_build_two.findByIdAndDelete({ _id: id }, (err, data) => {
    //  console.log(data);
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Sorry unable to delete area" });
    } else if (data == null) {
      return res
        .status(404)
        .json({ status: false, message: "No records found to delete" });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "Deleted Successfully" });
    }
  });
};

exports.editcomplexbuildtwo = async (req, res) => {
  const id = req.body.id;
  await complex_build_two.findOne({ _id: id }, (err, data) => {
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Ward data not exists" });
    } else {
      return res.status(200).json({ status: true, data });
    }
  });
};

exports.complex_search = async (req, res) => {
  const search = req.body.search;

  const search_data = await complex_build_two.aggregate([
    { $match: { $text: { $search: search }, category: "Residencial" } },
    {
      $lookup: {
        from: "comercial_buildings", // other table name
        localField: "complex_id", // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "comercial_buildings_info" // alias for userinfo table
      }
    },
    {
      $project: {
        _id: 0,
        //shop_address:0,
        house_address: "$comercial_buildings_info.address",
        owner_mobile: 1,
        owner_name: 1,
        uuid: 1
      }
    },
    { $limit: 1 },
    { $sort: { date: -1 } }
  ]);

  console.log(search_data);

  if (search_data.length != 0) {
    const family_mem1 = await Family_members.find({
      uuid: search_data[0].uuid
    }).exec();
    search_data[0]["total_members"] = family_mem1.length;
    search_data[0]["house_address"] = search_data[0]["house_address"][0];
    return res
      .status(200)
      .json({ status: true, data: search_data, message: "success" });
  } else {
    return res
      .status(400)
      .json({ status: false, data: [], message: "No results found" });
  }
};

exports.commercialflats_details = async (req, res) => {
  const uuid = req.body.uuid;
  const resi_details = await complex_build_two
    .find({ uuid: uuid }, { floor: 1, floor_no: 1, owner_name: 1 })
    .exec();
  return res
    .status(200)
    .json({ status: true, data: resi_details, message: "success" });
};

exports.complex_family_update = async (req, res) => {
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

  const cd = await complex_build_two.findOne({ uuid: uuid }, { _id: 1 }).exec();

  await complex_build_two.findByIdAndUpdate(
    { _id: cd._id },
    { ...updateRecords1 },
    (err, data) => {
      //  console.log(data);
      if (err) {
        return res
          .status(404)
          .json({
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
        return res
          .status(200)
          .json({ status: true, login: true, message: "Updated Successfully" });
      }
    }
  );
};

exports.updatecomplexbuildtwo = async (req, res) => {
  const _id = req.body.id;
  const {
    complex_id,
    floor,
    floor_no,
    category,
    business_type,
    business_name,
    shop_address,
    owner_name,
    owner_mobile,
    owner_aadhar,
    licence_number,
    existing_disposal,
    approx_quality_waste,
    user_id,
    status,
    log_date_created,
    log_date_modified,
    modified_by,
    latitude,
    longitude,
    wastage_quantity,
    resident_type
  } = req.body;
  const comp_details = await complex_building
    .findOne({ _id: complex_id })
    .exec();
  const zonerow = await zone
    .findOne({ _id: comp_details.zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();

  const circlerow = await circle
    .findOne(
      { _id: comp_details.circles_id },
      { _id: 1, name: 1, circle_no: 1 }
    )
    .exec();

  const wardrow = await wards
    .findOne(
      { _id: comp_details.ward_id },
      { _id: 1, name: 1, tenent_id: 1, wards_no: 1 }
    )
    .exec();

  const landmarkrow = await landmark
    .findOne(
      { _id: comp_details.landmark_id },
      { _id: 1, landmark_from: 1, landmark_to: 1 }
    )
    .exec();

  const arearow = await area
    .findOne({ _id: comp_details.area_id }, { _id: 1, name: 1 })
    .exec();
  let productPictures = [];
  if (req.files.length > 0) {
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.filename };
      });
    }
  } else {
    var compleximg = await complex_build_two
      .findOne({ _id: _id }, { image: 1 })
      .exec();
    productPictures = compleximg.image;
  }

  const qr_code_image_path = "uploads/qr-images/complex_building_two/qr_codes/";
  var template_image_path = "uploads/qr-images/complex_building_two/templates/";
  const unique_nos = await complex_build_two
    .findOne({ _id: _id }, { unique_no: 1 })
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
      loadImage("./complex_build_two.jpg").then((image) => {
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
        context.fillText(business_name, 435, 807);

        //  //vehicle type
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(category, 435, 865);
        //vehicle registeration no
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(comp_details.name, 435, 915);
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

  var place = {};
  place.type = "Point";
  place.coordinates = [];
  place.coordinates.push(req.body.latitude);
  place.coordinates.push(req.body.longitude);
  const updateRecords = {
    ...req.body,
    place: place,
    user_id: req.user.user_id,
    modified_by: req.user.user_id,
    log_date_modified: new Date(),
    unique_no: unique_no,
    qr_image: template_image_path + circles + "/" + unique_no + ".png",
    qr_code_view: template_image_path + circles + "/" + unique_no + ".png",
    image: productPictures
  };
  await complex_build_two.findByIdAndUpdate(
    { _id },
    { ...updateRecords },
    (err, data) => {
      if (err) {
        return res
          .status(404)
          .json({
            status: false,
            message: "Sorry unable to update complex building two"
          });
      } else if (data == null) {
        return res
          .status(404)
          .json({
            status: false,
            message: "Sorry unable to update complex building two"
          });
      } else if (data) {
        return res
          .status(200)
          .json({
            status: true,
            message: "Complex building two updated successfully"
          });
      }
    }
  );
};

exports.complexcategory_type = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Successfully completed",
    data: [
      {
        name: "Category 1"
      },
      {
        name: "Category 2"
      },
      {
        name: "Category 3"
      }
    ]
  });
};

exports.getcomplexdatafloor = async (req, res) => {
  const id = req.body.id;
  await complex_building.findOne(
    { _id: id },
    { basements: 1, ground_floors: 1, floors: 1 },
    (err, data) => {
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Complex building data not exists" });
      } else {
        // let finaldata = {};
        if (data) {
          let base = [];
          let basements = data.basements;
          var i;
          for (i = 1; i <= basements; i++) {
            base.push("Basement " + i);
          }
          //  finaldata.basements =  base;

          let groundfloor = data.ground_floors;
          let ground = [];
          var j;
          for (j = 1; j <= groundfloor; j++) {
            ground.push("Ground floor " + j);
          }
          //  finaldata.groundfloors =  ground;

          let floor = data.floors;
          let flo = [];
          var k;
          for (k = 1; k <= floor; k++) {
            flo.push("Floor " + k);
          }
          // finaldata.floors =  flo;
          var final = [...base, ...ground, ...flo];
          var finaldata = {};
          finaldata.floor = final;
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
          return res.status(200).json({ status: true, data: finaldata });
        } else {
          return res.status(200).json({ status: true, data: [] });
        }
      }
    }
  );
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/commercial_building/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

exports.upload_build2 = multer({ storage: storage });
