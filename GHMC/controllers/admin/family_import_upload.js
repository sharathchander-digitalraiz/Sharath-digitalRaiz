var multer      = require('multer');   
var excelToJson = require('convert-excel-to-json');    
var fs=require("fs");
const Family_members = require('../../model/family_members'); 
const residential_house= require("../../model/residential_house");


exports.import_data_covid = async (req, res) =>  
{
  const {user_id}=req.body;
  importExcelData2MongoDB('./uploads/excel/family/' + req.file.filename,user_id);
  responseObject = {'success':true,login: true,message:'Successfully Completed'};
  res.status(200).json(responseObject);
}    
// Import Excel File to MongoDB database
async function importExcelData2MongoDB(filePath,user_id)    
{
 
// -> Read Excel File to Json Data
const excelData = excelToJson({ 
sourceFile: filePath,
sheets:[{
// Excel Sheet Name
name: 'Total',
// Header Row -> be skipped and will not be present at our result object.
header:{
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
    G:'vacitaion_status',
    H:'first_dose',
    I:'firstdose_Date',
    J:'second_dose',
    K: 'second_dose_date',
    L:'vaccine_type'

}
}]
});
//  Log Excel Data to Console   
 //  console.log(excelData);   
var i=0;
const docs=[];
await Promise.all(excelData.Total.map( async(element,dind)=>  
{
    console.log(element)
    const uuid = await residential_house.findOne({ propertyno: element.property_no}, {_id: 0,uuid:1}).exec(); 

    let obj ={user_id:user_id,
        uuid: uuid.uuid,
        name:element.name,  
        age:element.age,
        gender:element.gender,
        mobile:element.mobile_no, 
        aadhar:element.aadhar,
        vaccine_yes_no:element.vacitaion_status,
        created_by:user_id,
        date: new Date()};

        if(element.vaccine_type == undefined){
            obj.vaccine_type = ''
        }else{
            obj.vaccine_type = element.vaccine_type
        }


        if(element.first_dose == undefined){
            obj.first_dose_yes_no = ''
        }else{
            obj.first_dose_yes_no = element.first_dose
        }
    
        if(element.firstdose_Date == undefined){
            obj.first_dost_date = ''
        }else{
            obj.first_dost_date = element.firstdose_Date
        }
    if(element.second_dose == undefined){
        obj.second_dose_yes_no = ''
    }else{
        obj.second_dose_yes_no = element.second_dose
    }

    if(element.second_dose_date == undefined){
        obj.second_dose_date = ''
    }else{
        obj.second_dose_date = element.second_dose_date
    }
    console.log(obj); 
    const family_list = new Family_members(obj) 
      await family_list.save();  


      const family_mem = await Family_members.find({ uuid: uuid.uuid }, {}).exec();
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
    const cd = await residential_house.findOne({ uuid: uuid.uuid }, { _id: 1 }).exec();
    await residential_house.findByIdAndUpdate({ _id: cd._id }, { ...updateRecords1 }, (err, data) => {
    console.log(err);

    })
  

}))
  

}

        

var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    { 
      cb(null, './uploads/excel/family');     
    },     
    filename: (req, file, cb) =>   
    {    
      cb(null,  Date.now() + '-' + file.originalname);        
    }
});

exports.upload_user_family = multer({storage: storage});
    
