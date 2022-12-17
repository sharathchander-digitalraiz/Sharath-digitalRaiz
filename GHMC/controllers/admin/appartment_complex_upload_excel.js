
const complex_building = require("../../model/complex_building");
const Family_members = require("../../model/family_members");
const complex_build_two = require("../../model/complex_build2");
const comunityHall = require("../../model/communityhall");
const unique_nos = require('../../model/unique_nos');
const zones = require('../../model/zones');
const pwdhash = require('node-php-password');
const users = require('../../model/users');
const circles = require('../../model/circles');
const wards = require('../../model/wards');
const areas = require('../../model/area');
const landmark = require('../../model/landmarks');
const Str = require('@supercharge/strings');
var multer = require('multer');
var excelToJson = require('convert-excel-to-json');
var fs = require("fs");
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { createCanvas, loadImage } = require('canvas');

exports.import_data_apartmentComplex = async (req, res) => {
  try {
    const { user_id } = req.body;
    importExcelData2MongoDB('./uploads/excel/' + req.file.filename, user_id);
    responseObject = { 'success': true, login: true, message: 'Successfully completed' };
    res.status(200).json(responseObject);
  } catch (err) {
    res.status(err.status).json({ message: err.message, error: err.error })
  }

}

// Import Excel File to MongoDB database  
async function importExcelData2MongoDB(filePath, user_id) {
  console.log(filePath);
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [{
      // Excel Sheet Name
      name: 'Total',
      // Header Row -> be skipped and will not be present at our result object.
      header: {
        rows: 1
      },
      // Mapping columns to keys
      columnToKey: {
        A: 'zone',
        B: 'circle',
        C: 'ward',
        D: 'area',
        E: 'landmark',
        F: 'name',
        G: 'address',
        H: 'basements',
        I: 'ground_floors',
        J: 'floors',
        K: 'propertyno',
        L: 'coordinates'
      }
    }]
  });
  // -> Log Excel Data to Console
  //console.log(excelData);
  var i = 0;
  const docs = [];
  await Promise.all(excelData.Total.map(async (element, dind) => {
    var uuid = await module.exports.generateuuid();
    console.log(element.zone);
    const zonerow = await zones.findOne({ name: element.zone.trim() }, {}).exec();
    console.log("zonerow");
    console.log(zonerow);
    const circlerow = await circles.findOne({ name: element.circle.trim() }, {}).exec();
    console.log(circlerow);
    const wardrow = await wards.findOne({ name: element.ward.trim() }, {}).exec();
    console.log(wardrow);
    const landmarkrow = await landmark.findOne({ landmark_from: element.landmark.trim() }, {}).exec();
    console.log(element.landmark.trim());
    console.log("landmark");
    console.log(landmarkrow);
    const arearow = await areas.findOne({ name: element.area.trim() }, {}).exec();
    console.log(element.area.trim());
    console.log("area");
    console.log(arearow);
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based

    var curr_year = d.getFullYear();
    if (curr_month > 10) {
      curr_month = curr_month;
    }
    else {
      curr_month = '0' + curr_month;
    }
    var dates = curr_year + '-' + curr_month + '-' + curr_date;
    const place = {};
    place.type = 'Point';
    place.coordinates = [];
    let cor = element.coordinates.split(',')
    place.coordinates.push(Number(cor[0]));
    place.coordinates.push(Number(cor[1]));
    // console.log(place)
    docs.push({
      uuid: uuid,
      date: dates,
      zone: zonerow.name,
      circle: circlerow.name,
      circle_no: circlerow.circle_no,
      ward_name: wardrow.name,
      area: arearow.name,
      landmark: landmarkrow.landmark_from + '-' + landmarkrow.landmark_to,
      name: element.name,
      address: element.address,
      basements: element.basements,
      ground_floors: element.ground_floors,
      floors: element.floors,
      propertyno: element.propertyno,
      zones_id: zonerow._id,
      tenent_id: zonerow.tenent_id,
      circles_id: circlerow._id,
      ward_id: wardrow._id,
      landmark_id: landmarkrow._id,
      area_id: arearow._id,
      user_id: user_id,
      place: place,
      image: '',
      wards_no: wardrow.wards_no,
      latitude: cor[0],
      longitude: cor[1],

    });


  }))
  console.log(docs);
  await Promise.all(docs.map(async (val, index) => {

    const qr_code_image_path = 'uploads/qr-images/complex_building/qr_codes/';
    var template_image_path = 'uploads/qr-images/complex_building/templates/';
    var circles = val.circle;
    fs.mkdir(qr_code_image_path + circles, function (err) { })
    fs.mkdir(template_image_path + circles, function (err) { })
    var unique_no = await module.exports.generate();
    QRCode.toFile(qr_code_image_path + circles + '/' + unique_no + '.png', unique_no, { version: 10 },
      function (err) {
        loadImage("./complex_building.jpg").then((image) => {
          context.drawImage(image, 0, 0, 1152, 1920);
          const buffer = canvas.toBuffer('image/png');
          fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
          context.drawImage(image, 0, 0);
        });
        const width = 698;
        const height = 1280;
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);


        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
        const qr_codes = qr_code_image_path + circles + '/' + unique_no + '.png';
        loadImage(qr_codes).then((image) => {
          context.fillStyle = "#000";
          context.font = "28px cambria";
          context.textAlign = "left";
          context.fillText(val.name, 435, 807);

          //  //vehicle type
          context.fillStyle = "#000";
          context.font = "28px cambria";
          context.textAlign = "left";
          context.fillText(val.address, 435, 865);
          //vehicle registeration no
          context.fillStyle = "#000";
          context.font = "28px cambria";
          context.textAlign = "left";
          context.fillText(val.floors, 435, 915);
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
          const buffer = canvas.toBuffer('image/png');
          fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
          context.drawImage(image, 0, 0);
        });
      });
    const unique_noss = new unique_nos({
      unique_no: unique_no,
      user_id: user_id,
      type_db: 'comercial_buildings',
    })

    unique_noss.save();
    console.log("val");
    console.log(val);

    const list = new complex_building({
      uuid: val.uuid,
      date: val.date,
      user_id: user_id,
      zones_id: val.zones_id,
      circles_id: val.circles_id,
      ward_id: val.ward_id,
      landmark_id: val.landmark_id,
      area_id: val.area_id,
      zone: val.zone,
      circle_no: val.circle_no,
      circle: val.name,
      wards_no: val.wards_no,
      ward_name: val.name,
      area: val.name,
      landmark: val.landmark,
      name: val.name,
      place: val.place,
      address: val.address,
      basements: val.basements,
      ground_floors: val.ground_floors,
      floors: val.floors,
      tenent_id: val.tenent_id,
      latitude: val.latitude,
      longitude: val.longitude,
      image: [],
      unique_no: unique_no,
      propertyno: val.propertyno,
      qr_image: template_image_path + circles + "/" + unique_no + '.png',
      qr_code_view: template_image_path + circles + "/" + unique_no + '.png'
    });

    await list.save();
  }));

}


exports.generate = async (req, res) => {
  const string = Str.random(25);
  const checkstring = await comunityHall.findOne({ unique_no: string }, { _id: 1 }).countDocuments();
  if (checkstring == 0) {
    return string;
  }
  else {
    module.exports.generate();
  }
}


exports.import_data_apartmentComplexFlats = async (req, res) => {
  try {
    const { user_id } = req.body;
    importExcelData2MongoDBFlats('./uploads/excel/' + req.file.filename, user_id);
    responseObject = { 'success': true, login: true, message: 'Successfully completed' };
    res.status(200).json(responseObject);
  } catch (err) {
    res.status(err.status).json({ message: err.message, error: err.error })
  }

}


async function importExcelData2MongoDBFlats(filePath, user_id) {
  console.log(filePath);
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [{
      // Excel Sheet Name
      name: 'Total',
      // Header Row -> be skipped and will not be present at our result object.
      header: {
        rows: 1
      },
      // Mapping columns to keys
      columnToKey: {
        A: 'property_no',
        B: 'floor',
        C: 'flat_number',
        D: 'category_type',
        E: 'resident_type',
        F: 'business_type',
        G: 'business_name',
        H: "business_address",
        I: "licence_exist",
        J: "licence_no",
        K: 'owner_name',
        L: 'owner_mobile_number',
        M: "owner_aadhar",
        N: 'existing_disposal',
        O: 'quantity_waste',
        P: 'wastage_weight',
        Q: 'coordinates'
      }
    }]
  });
  // -> Log Excel Data to Console
  //console.log(excelData);
  var i = 0;
  const docs = [];
  await Promise.all(excelData.Total.map(async (element, dind) => {
    console.log(element.property_no);
    const complex_buildingrow = await complex_building.findOne({ propertyno: element.property_no }, {}).exec();
    const zonerow = await zones.findOne({ _id: complex_buildingrow.zones_id }, {}).exec();
    console.log("zonerow");
    console.log(zonerow);
    const circlerow = await circles.findOne({ _id: complex_buildingrow.circles_id }, {}).exec();
    console.log(circlerow);
    const wardrow = await wards.findOne({ _id: complex_buildingrow.ward_id }, {}).exec();
    console.log(wardrow);
    const landmarkrow = await landmark.findOne({ _id: complex_buildingrow.landmark_id }, {}).exec();
    console.log(landmarkrow);
    const arearow = await areas.findOne({ _id: complex_buildingrow.area_id }, {}).exec();
    console.log(arearow);
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based

    var curr_year = d.getFullYear();
    if (curr_month > 10) {
      curr_month = curr_month;
    }
    else {
      curr_month = '0' + curr_month;
    }
    var dates = curr_year + '-' + curr_month + '-' + curr_date;
    const place = {};
    place.type = 'Point';
    place.coordinates = [];
    let cor = element.coordinates.split(',')
    place.coordinates.push(Number(cor[0]));
    place.coordinates.push(Number(cor[1]));
    // console.log(place)
    docs.push({
      date: dates,
      building: complex_buildingrow,
      zone: zonerow.name,
      circle: circlerow.name,
      circle_no: circlerow.circle_no,
      ward_name: wardrow.name,
      area: arearow.name,
      landmark: landmarkrow.landmark_from + '-' + landmarkrow.landmark_to,
      property_no: element.property_no,
      floor: element.floor,
      flat_number: element.flat_number,
      category_type: element.category_type,
      resident_type: element.resident_type,
      business_type: element.business_type,
      business_name: element.business_name,
      business_address: element.business_address,
      licence_exist: element.licence_exist,
      licence_no: element.licence_no,
      owner_name: element.owner_name,
      owner_mobile_number: element.owner_mobile_number,
      owner_aadhar: element.owner_aadhar,
      existing_disposal: element.existing_disposal,
      quantity_waste: element.quantity_waste,
      wastage_weight: element.wastage_weight,
      zones_id: zonerow._id,
      circles_id: circlerow._id,
      ward_id: wardrow._id,
      landmark_id: landmarkrow._id,
      area_id: arearow._id,
      user_id: user_id,
      place: place,
      image: ''
    });


  }))
  console.log(docs);
  await Promise.all(docs.map(async (val, index) => {

    const qr_code_image_path = 'uploads/qr-images/complex_building_two/qr_codes/';
    var template_image_path = 'uploads/qr-images/complex_building_two/templates/';


    var circles = val.circle;
    fs.mkdir(qr_code_image_path + circles, function (err) { })
    fs.mkdir(template_image_path + circles, function (err) { })
    var unique_no = await module.exports.generate();
    QRCode.toFile(qr_code_image_path + circles + '/' + unique_no + '.png', unique_no, { version: 10 },
      function (err) {
        loadImage("./complex_build_two.jpg").then((image) => {
          context.drawImage(image, 0, 0, 1152, 1920);
          const buffer = canvas.toBuffer('image/png');
          fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
          context.drawImage(image, 0, 0);
        });
        const width = 698;
        const height = 1280;
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);


        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
        const qr_codes = qr_code_image_path + circles + '/' + unique_no + '.png';
        loadImage(qr_codes).then((image) => {
          context.fillStyle = "#000";
          context.font = "28px cambria";
          context.textAlign = "left";
          context.fillText(val.building.business_name, 435, 807);

          //  //vehicle type
          context.fillStyle = "#000";
          context.font = "28px cambria";
          context.textAlign = "left";
          context.fillText(val.category_type, 435, 865);
          //vehicle registeration no
          context.fillStyle = "#000";
          context.font = "28px cambria";
          context.textAlign = "left";
          context.fillText(val.building.name, 435, 915);
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
          const buffer = canvas.toBuffer('image/png');
          fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
          context.drawImage(image, 0, 0);
        });
      });
    const unique_noss = new unique_nos({
      unique_no: unique_no,
      user_id: user_id,
      type_db: 'comercial_flats',
    })

    unique_noss.save();
    console.log("val");
    console.log(val);
    const log_date_created = new Date();
    const list = new complex_build_two({
      uuid: val.building.uuid,
      licence_no: val.licence_no,
      complex_id: val.building._id,
      floor: val.floor,
      floor_no: val.flat_number,
      category: val.category_type,
      business_type: val.business_type,
      business_name: val.business_name,
      shop_address: val.business_address,
      owner_name: val.owner_name,
      owner_mobile: val.owner_mobile_number,
      owner_aadhar: val.owner_aadhar,
      licence_number: val.licence_number,
      existing_disposal: val.existing_disposal,
      approx_quality_waste: val.quantity_waste,
      user_id: user_id,
      created_by: user_id,
      log_date_created: log_date_created,
      log_date_modified: log_date_created,
      modified_by: user_id,
      status: "Active",
      place: val.place,
      eighteenbelow: "",
      propertyno: val.property_no,
      eighteenabove: "",
      wastage_quantity: val.wastage_weight,
      resident_type: val.resident_type,
      unique_no: unique_no,
      qr_image: template_image_path + circles + "/" + unique_no + '.png',
      qr_code_view: template_image_path + circles + "/" + unique_no + '.png',
      image: []
    });

    await list.save();
  }));

}


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/excel');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

exports.upload_user_res = multer({ storage: storage });

exports.generateuuid = async (req, res) => {
  const string = Str.random(25);
  const checkstring = await complex_building.findOne({ uuid: string }, { _id: 1 }).countDocuments();
  if (checkstring == 0) {
    return string;
  }
  else {
    module.exports.generate();
  }
}
exports.import_data_commercial_memebers = async (req, res) => {
  const { user_id } = req.body;
  importcommercial_memebers('./uploads/excel/family/' + req.file.filename, user_id);
  responseObject = { 'success': true, login: true, message: 'Successfully Completed' };
  res.status(200).json(responseObject);
}
// Import Excel File to MongoDB database
async function importcommercial_memebers(filePath, user_id) {

  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [{
      // Excel Sheet Name
      name: 'Total',
      // Header Row -> be skipped and will not be present at our result object.
      header: {
        rows: 1
      },
      // Mapping columns to keys
      columnToKey: {
        A: 'property_no',
        B: 'name',
        C: 'gender',
        D: 'age',
        E: 'mobile_no',
        F: 'aadhar',
        G: 'vacitaion_status',
        H: 'first_dose',
        I: 'firstdose_Date',
        J: 'second_dose',
        K: 'second_dose_date',
        L: 'vaccine_type'

      }
    }]
  });
  //  Log Excel Data to Console   
  //  console.log(excelData);   
  var i = 0;
  const docs = [];
  await Promise.all(excelData.Total.map(async (element, dind) => {
    console.log(element)
    const complex_building_data = await complex_building.findOne({ propertyno: element.property_no }, { _id: 0, uuid: 1 }).exec();

    let obj = {
      user_id: user_id,
      uuid: complex_building_data.uuid,
      name: element.name,
      age: element.age,
      gender: element.gender,
      mobile: element.mobile_no,
      aadhar: element.aadhar,
      vaccine_yes_no: element.vacitaion_status,
      created_by: user_id,
      date: new Date()
    };

    if (element.vaccine_type == undefined) {
      obj.vaccine_type = ''
    } else {
      obj.vaccine_type = element.vaccine_type
    }


    if (element.first_dose == undefined) {
      obj.first_dose_yes_no = ''
    } else {
      obj.first_dose_yes_no = element.first_dose
    }

    if (element.firstdose_Date == undefined) {
      obj.first_dost_date = ''
    } else {
      obj.first_dost_date = element.firstdose_Date
    }
    if (element.second_dose == undefined) {
      obj.second_dose_yes_no = ''
    } else {
      obj.second_dose_yes_no = element.second_dose
    }

    if (element.second_dose_date == undefined) {
      obj.second_dose_date = ''
    } else {
      obj.second_dose_date = element.second_dose_date
    }
    console.log(obj);
    const family_list = new Family_members(obj)
    await family_list.save();

    /****Family members  Update into Comercial building Flats*/
    // familys.name=(element.name == undefined) ? '': element.name; 
    // familys.gender=(element.gender == undefined) ? '': element.gender; 
    // familys.age=(element.age == undefined) ? '': element.age;
    // familys.mobile=(element.mobile == undefined) ? '': element.mobile;
    // familys.aadhar=(element.aadhar == undefined) ? '': element.aadhar;
    // familys.eighteen_plus='';
    // familys.property_no=element.property_no;
    // familys.vaccine_type=(element.vaccine_type == undefined) ? '': element.vaccine_type;
    // familys.first_dose_yes_no=(element.first_dose_yes_no == undefined) ? '': element.first_dose_yes_no;
    // familys.first_dost_date=(element.first_dost_date == undefined) ? '': element.first_dost_date;
    // familys.second_dose_yes_no=(element.second_dose_yes_no == undefined) ? '': element.second_dose_yes_no;
    // familys.second_dose_date=(element.second_dose_date == undefined) ? '': element.second_dose_date;
    // familys.vaccine_yes_no=(element.vaccine_yes_no == undefined) ? '': element.vaccine_yes_no;




    const family_mem = await Family_members.find({ uuid: complex_building_data.uuid }, {}).exec();
    let familys = [];
    console.log(family_mem);
    console.log("family_mem");
    familys = family_mem.map((val) => {
      let first_dose = (val.first_dose_yes_no == undefined) ? '' : val.first_dose_yes_no;
      let fir_dose_date = (val.first_dost_date == undefined) ? '' : val.first_dost_date;
      let second_dose = (val.second_dose_yes_no == undefined) ? '' : val.second_dose_yes_no;
      let sec_dose_date = (val.second_dose_date == undefined) ? '' : val.second_dose_date;
      let vaccine_yes_no = (val.vaccine_yes_no == undefined) ? '' : val.vaccine_yes_no;
      return {
        name: val.name, gender: val.gender, age: val.age, mobile: val.mobile, aadhar: val.aadhar,
        vaccine_type: val.vaccine_type, first_dose_yes_no: first_dose, first_dost_date: fir_dose_date,
        second_dose_yes_no: second_dose, second_dose_date: sec_dose_date, vaccine_yes_no: vaccine_yes_no
      }
    });
    const updateRecords1 = {

      family: familys
    }

    console.log(updateRecords1);
    const cd = await complex_build_two.findOne({ uuid: complex_building_data.uuid }, { _id: 1 }).exec();
    await complex_build_two.findByIdAndUpdate({ _id: cd._id }, { ...updateRecords1 }, (err, data) => {
      console.log(err);

    })


  }))



}



var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/excel/family');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

exports.upload_comercial_family = multer({ storage: storage });