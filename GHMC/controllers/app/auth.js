const useraccess = require('../../model/useraccess'); 
const usercategory = require('../../model/accesscategory'); 
const Geotagtypes = require('../../model/geotagtype'); 
const users = require('../../model/users'); 
const config = require('../../config/configuration');
let jwt = require('jsonwebtoken');
const pwdhash = require('node-php-password');
const Zones = require('../../model/zones'); 
const Circles=require("../../model/circles");
const Wards=require("../../model/wards");
const Landmarks=require('../../model/landmarks');
exports.login = (req, res) =>  
{
const { identity,password} = req.body; 

users.findOne({username:identity}).exec( async( err,user_data) => 
{ 
    if(user_data)    
    {                   
        if(pwdhash.verify(password, user_data.password))          
        {
            let token = jwt.sign({ username: identity, user_id: user_data._id }, config.secret,{ expiresIn:'24h' });
           
            await users.findByIdAndUpdate(
              { _id: user_data._id },
              { fcm_token: req.body.fcm_token },(err,res)=>{
                if(res){
                  console.log('updated')
                }
              });

            let data = {};  
            data.user_id = user_data._id; 
            data.first_name = user_data.first_name; 
            data.last_name = user_data.last_name;  
            data.email = user_data.email;   
            data.mobile = user_data.mobile_number;  
            data.department_id=user_data.department_id;     
            data.department_name=user_data.department_name;    
            data.tenent_id = user_data.tenent_id;
            data.token = token; 
            
            data.access=[];
             let app_acc;   
          
            let land; 
            let land2; 
            let zone2; 
            let ward2;
            let circle2; 
            let access_button; 
            let access = [] ; 
            //let geo_tag_acc;
            let geo_tag_acc =[];
             await useraccess.findOne({_id:user_data.user_access_id}).then( async (data)=>{
             if(data == null){
              app_acc = []; 
             }else{   
              app_acc = data.app_access;   
              access_button = await Geotagtypes.find( { _id:data.geo_tag_id },{_id:0,name:true,id: "$_id"}).exec(); 
            //  console.log(access); 
              land = await Landmarks.find( { _id:data.landmarks },{_id:true,landmark_from:true}).exec(); 
              land.forEach(async (value)=>{
                land2 = await Landmarks.find( { _id:value._id }).exec(); 
                zone2 = await Zones.find( { _id:land2[0].zones_id }).exec(); 
                circle2 =  await Circles.find( { _id:land2[0].circles_id }).exec(); 
                ward2 = await Wards.find( { _id:land2[0].wards_id }).exec(); 
                var obj = {};
                obj["zone"] = zone2[0].name;
                obj["zone_id"] = zone2[0]._id; 
                obj["circle"] = circle2[0].name;
                obj["circle_id"] = circle2[0]._id;
                obj["ward"]  = ward2[0].name;
                obj["ward_id"] = ward2[0]._id;
                obj["landmarks"] = land2[0].landmark_from; 
                obj["landmarks_id"] = land2[0]._id; 
                obj["geo_tag_buttons"] = access_button; 
              //  console.log(obj);
              access.push(obj);
              })
             }       
             geo_tag_acc.push(data.appaccess);
            })  
            setTimeout(function(){  
              finalresult =  {...data,access,geo_tag_acc};    
              responseObject =  {success: true,login: true,message: 'Authentication successfull!',data: finalresult}
              res.status(200).json(responseObject); 
             }, 3000);
        }  
        else   
        {  
            responseObject = {'success':false,login: false,message:'Incorrect password','data':[]}
            res.status(400).json(responseObject);
        }
    }      
    else  
    {   
      responseObject = {'success':false,login: false,message:'Incorrect Username or password','data':[]}
      res.status(400).json(responseObject);
    }
  });
}

exports.access=async (req,res) =>
{
  try{
    const {user_id} = req.body;
    let app_acc;   
    console.log(user_id);
    const userdata =await users.findOne({_id:user_id}).exec();
     await useraccess.findOne({_id:userdata.user_access_id}).then( async (data)=>{
     if(data == null){
      app_acc = {};
     }else{   
        app_acc = data.appaccess;
     }      
    })  
    setTimeout(function(){  
      responseObject =  {success: true,login: true,message: 'successfully completed',data: app_acc}
      res.status(200).json(responseObject); 
     }, 3000);
  }
  catch
  {
    responseObject =  {success: false,login: true,message: 'something error occured.Please try again'}
    res.status(400).json(responseObject); 
  }
  
}
exports.token_validate = (req, res) =>  
{
   const bearerHeader = req.headers['authorization'];
   if (bearerHeader)
   {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, 'worldisfullofdevelopers',(err,data)=>
      { 
          if(err)
          { 
           console.log(data);
           return res.status(400).json({success:false,login:flase,message: "Session expired" }); 
          }
          else
          {
              return res.status(200).json({success:true,login:true,message: "Login successfully completed" }); 
          }  
      });  
    }
    else
    {
      return res.status(400).json({success:false,login:false,message: "Authorization"});  
    }
}
exports.user_access = async (req, res) =>  
{
  const { user_id} = req.body; 
  const crows = await users.findOne({_id:user_id},{user_access_id : 1}).countDocuments();
  if(crows!="")
  {
      const data=await users.findOne({_id:user_id},{user_access_id : 1}).exec();
      const crowsdata = await useraccess.find({_id:data.user_access_id}).exec();
      console.log("crowsdata");
      console.log(crowsdata[0].appaccess);
      responseObject =  {success: true,login: true,message: 'successfully completed',data:[crowsdata[0].appaccess]}
      res.status(200).json(responseObject);  
  }
  else
  {
    responseObject =  {success: true,login: true,message: 'Not assign',data:[]}
    res.status(200).json(responseObject);  
  }
}
