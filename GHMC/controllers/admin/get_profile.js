const User = require('../../model/users');
const multer = require('multer'); 
const pwdhash = require('node-php-password');


exports.getProfile = async(req,res,next)=>{
        let users = await User.findOne({_id: req.params.userId},{first_name:1,last_name:1,mobile_number:1,username:1,department_name:1,profile:1,
          email:1});
       //console.log(users);
        res.status(200).json({message:'success',status:true, data: users})
}

exports.updateProfile = async(req,res,next)=>{

  const user_data = await User.findOne({_id:req.params.userId}).exec();
        const profile1 = (req.file)?req.file.path:user_data.profile; 
       //console.log(profile1);
       console.log(req.body);
       console.log(req.file);
        let obj ={profile:profile1,first_name:req.body.first_name,last_name:req.body.last_name,
        mobile_number:req.body.mobile_number,email:req.body.email};  
        console.log(obj);
       let update_profile = await User.findByIdAndUpdate({_id:req.params.userId},obj);
       res.status(200).json({message:update_profile,status:true}); 
}

exports.changePassword = async(req,res,next)=>{
    const user_data = await User.findOne({_id:req.body.userId}).exec();
    if(user_data){
      if(pwdhash.verify(req.body.confirm_password, user_data.password)) {
        let obj = {password:pwdhash.hash(req.body.password)}
        let result = await User.findByIdAndUpdate({_id:req.body.userId},obj);
        res.status(200).json({message:'Password updated successfully', status:true})
      }else{
          res.status(400).json({status:false,message:'Please enter correct password'})
      } 
    }

}


var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    { 
      cb(null, './uploads/profile'); 
    }, 
    filename: (req, file, cb) => 
    {
      cb(null,  Date.now() + '-' + file.originalname);  
    }
});

exports.upload_profile = multer({storage: storage});




