const users = require('../../model/users'); 
const department = require('../../model/department'); 
const pwdhash = require('node-php-password');
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

exports.getUsers_sadmin = async (req, res) =>  
{
  const alldata = await users.aggregate([
    { "$match": { "add_type": 'Super admin' } }, 
    {     
      $lookup:{   
          from: "tenents",       // other table name 
          localField: "tenent_id",   // name of users table field 
          foreignField: "_id", // name of userinfo table field 
          as: "tenent_info"         // alias for userinfo table 
      } 
  },// define which fields are you want to fetch  
  {   $unwind:"$tenent_info" }, 
  {   
    $project:{  
        _id : 1,   
        first_name: 1, 
        last_name: 1,
        department_name:1,
        email:1,
        mobile_number:1,
        username:1,
        tenent_id:1,
        status:1,
        department_id:1,
        tenent_name: "$tenent_info.name",
        log_date_created:1
    }  
}
  ]);
//const user = await users.find({add_type:'Super admin'},{ _id: 1,first_name: 1, last_name: 1,department_name:1,email:1,mobile_number:1,username:1,user_access_name:1,log_date_created:1 } ).exec();
responseObject = {'success':true,login: true,message:'Sucessfully completed','data':alldata};
res.status(200).json(responseObject);
}





exports.addUser_sadmin = async (req, res) =>   
{
  const { first_name, last_name, username,department_id,password,email,mobile_number,status,tenent_id} = req.body;
  const drow = await department.findOne({_id:department_id},{ _id: 1,name: 1}).exec();
  const urows = await users.find({username:username},{ _id: 1}).countDocuments();
  console.log(req.body); 
  //console.log(drow);
if(urows==0)
  {
    const user = new users({
      first_name: first_name,
      last_name: last_name,
      username:username,
      department_id:department_id,
      department_name:drow.name,
      add_type:'Super admin', 
      tenent_id:tenent_id, 
      password:pwdhash.hash(password),
      email:email,
      mobile_number:mobile_number,
      status:status,
      created_by:req.user.user_id,
  
     
  });
  user.save((error, user) =>
  {
      if(error) return res.status(400).json({ error });
      if(user) 
      {
        responseObject = {success: true,login: true,message: 'Saved successfully'}
        res.status(200).json(responseObject);
      }
    });
  }
  else
  {
    responseObject = {success: false,login: true,message: 'Username already existed'}
    res.status(200).json(responseObject);
  }
};


exports.singleUser_sadmin = async (req, res) =>  
{
  const {id} = req.body;
  const alldata = await users.aggregate([
    { "$match": { "_id": new ObjectId(id) } }, 
    {     
      $lookup:{   
          from: "tenents",       // other table name 
          localField: "tenent_id",   // name of users table field 
          foreignField: "_id", // name of userinfo table field 
          as: "tenent_info"         // alias for userinfo table 
      } 
  },// define which fields are you want to fetch  
  {   $unwind:"$tenent_info" }, 
  {   
    $project:{  
        _id : 1,   
        first_name: 1, 
        last_name: 1,
        department_name:1,
        email:1,
        mobile_number:1,
        status:1, 
        username:1,
        tenent_id:1,
        department_id:1, 
        tenent_name: "$tenent_info.name",
        log_date_created:1
    }  
}
  ]);
//const user = await users.find({add_type:'Super admin'},{ _id: 1,first_name: 1, last_name: 1,department_name:1,email:1,mobile_number:1,username:1,user_access_name:1,log_date_created:1 } ).exec();
responseObject = {'success':true,login: true,message:'Sucessfully completed','data':alldata};
res.status(200).json(responseObject);
};



exports.updateUser_sadmin = async (req, res) =>  
{
    const id = req.body.id;
    if(!id){
      return  res.status(404).json({status:false,message:'Id is required'});  
    }

    const updateRecords = {
        ...req.body, 
    }
    await users.findByIdAndUpdate({_id:id},{...updateRecords},(err,data)=>{  
        //  console.log(data); 
           if(err){ 
               return res.status(404).json({status:false,message:'Sorry unable to update'});   
           }else if(data == null){ 
               return res.status(404).json({status:false,message:'Invalid id'});   
           }else{   
               return res.status(200).json({status:true,message:'Updated Successfully'});   
           }
       }) 
};



exports.deleteUser_sadmin = async (req, res) =>  
{
  const {id} = req.body;
  const data = await users.findOne({_id:id}).countDocuments();
  if(data!="0")
  {
    users.findByIdAndRemove({_id:id}, 
      function(err, docs)
      {
        if(err)
        {
          responseObject = {success: false,login: true,message: 'Something went wrong please try again'}
          res.status(400).json(responseObject);
        }
        else   
        {
          responseObject = {success: true,login: true,message: 'Deleted Successfully'}
          res.status(200).json(responseObject);
        }
   });
  }
  else
  {
    responseObject = {success: true,login: true,message: 'Invalid Id'}
    return res.status(200).json(responseObject);
  }
  
};
