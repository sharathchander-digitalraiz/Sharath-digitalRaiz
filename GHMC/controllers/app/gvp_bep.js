const gvpbep = require('../../model/gvpbep'); 
const zones=require('../../model/zones');
const wards=require("../../model/wards");
const user =require("../../model/users");
const circles =require("../../model/circles");
const useraccess=require("../../model/useraccess");
const garbagetrips=require("../../model/garbagetrips");
var multer = require('multer');
var gvpbepimage_url="http://103.160.144.135/uploads/gvp_bep/trips/";

                                                                   
exports.mapgvpbvp = async(req, res) =>  
{ 
  const { user_id,date} = req.body;
  let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();

  let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();

  let gvpbep_data=await gvpbep.find({circle_id:user_access_data.circles}).exec();

  console.log(gvpbep_data);
  let finalResult =[]; 
  await Promise.all(gvpbep_data.map(async (value)=>
  {
    var result ={}; 
    result.id=value._id; 
    if(value.type=='GVP' || value.type=='Gvp')
    {
      result.type= 'GVP'; 
    }
    if(value.type=='BEP' || value.type=='Bep')
    {
      result.type= 'BEP'; 
    }
    //result.type=value.type; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0].toString();
    result.longitude=""+value.place.coordinates[1].toString();
    //console.log(new date(date));
    let trips=await garbagetrips.find({import_gvp_bep_id:value._id,date:date}).countDocuments();
    let trips_data=await garbagetrips.findOne({import_gvp_bep_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    
    if(trips==0)
    {
   
        if(value.type=='GVP' || value.type=='gvp')
        {
            result.color = 'Red'; 
        }
        else if(value.type=='BEP' || value.type=='BEP')
        {
            result.color = 'Orange'; 
        }
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+trips_data.image;
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+trips_data.image;
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+trips_data.image;
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  responseObject = {success: true,login: true,data:finalResult};
res.status(200).json(responseObject);
}

exports.add_support = async(req, res) =>  
{ 
    const { user_id,support_list_id,description} = req.body; 
    const image=req.file.filename; 
    const su = new support({
        user_id:user_id,
        support_list_id:support_list_id,
        description:description,
        created_by:user_id,image:image

    });
    su.save((error, data) =>
    {
        if(error) return res.status(400).json({ success: false,login: true,message:"Something went wrong.Please try again" });
        if(data) 
        {
          responseObject = {success: true,login: true,message: 'Saved successfully'}
          res.status(200).json(responseObject);
        }
    });
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    {
      cb(null, './uploads/complaint/')
    },
    filename: (req, file, cb) => 
    {
      cb(null,  Date.now() + '-' + file.originalname)
    }
});

exports.upload = multer({storage: storage});




exports.gvp_bep_list = async (req, res) => 
{
  const { user_id} = req.body;
  const gvpbep_rows = await gvpbep.find({latitude:"",longitude:""},{_id:0,id:"$_id",type:1,area:1,landmark:1,
    ward_name:1,circle:1,zone:1,latitude:1}).exec();
    responseObject = { success: true, login: true, message:'Successfully Completed',data:gvpbep_rows}
    res.status(200).json(responseObject);
}




exports.add_gvp_bep = async (req, res) => 
{
  const { user_id,id,address,latitude,longitude} = req.body;
console.log(req.body);
  const gvpbep_rows = await gvpbep.findOneAndUpdate({_id:id},{location:address,latitude:latitude,longitude:longitude,log_date_modified:Date.now(),modified_by:user_id},
  (err,data)=>
  {
    if(err)
    {
      responseObject = { success: false, login: true, message:'Oops something went wrong.Please try again'}
      res.status(400).json(responseObject);
    }
    else
    {
      responseObject = { success: true, login: true, message:'Saved successfully'}
      res.status(200).json(responseObject);
    }
  });
}


exports.add_new_gvp_bep = async (req, res) => 
{
  const { user_id,type,longitude,lattitude,area,landmark,ward,circle,zone,location} = req.body;
  const zonerow = await zones.findOne({ _id: zone}, {_id: 1, name: 1,tenent_id:1 }).exec();
  const circlerow = await circles.findOne({ _id: circle}, {_id: 1, name: 1 }).exec();
  const wardsrow = await wards.findOne({ _id: ward}, {_id: 1, name: 1,ward_no:1 }).exec();
  const usersrow = await user.findOne({ _id: user_id},{_id: 1, first_name: 1,last_name:1,department_name:1,mobile_number:1 }).exec();
  /*const landmark_id=null;
  const landmarkrow = await zone.findOne({ name: landmark}).exec();
  if(landmarkrow.name!="")
  {
    landmark_id=landmarkrow
  }*/
const place={};
place.type='Point';
place.coordinates=[];
place.coordinates.push(lattitude);
place.coordinates.push(longitude);

  const save_gvpbeps = new gvpbep({
  zone:zonerow.name,
  circle:circlerow.name,
  ward_no:wardsrow.ward_no,
  ward_name:wardsrow.name,
  incharge:usersrow.first_name+'-'+usersrow.last_name,
  designation:usersrow.department_name,
  mobile_number:usersrow.mobile_number,
  area:area,
  landmark:landmark,
  location:location,
  latitude:lattitude,
  longitude:longitude,
  zone_id:zone,
  circle_id:circle,
  ward_id:ward,
  landmark_id:null,
  created_by:user_id,
  modified_by:null,
  type:type,
  status:"Active",
  place:place
  });
  save_gvpbeps.save((error, user) => 
  {
    console.log(user);
 console.log("user");
 console.log(error);
    if (error) return res.status(400).json({success: false, login: true, message: error});
    if (user) {
      responseObject = { success: true, login: true, message: 'Saved successfully' }
      res.status(200).json(responseObject);
    }
  });
}