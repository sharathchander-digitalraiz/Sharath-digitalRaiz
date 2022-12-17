const Importdata = require('../../model/importdata');  
const Importtransferstation = require('../../model/import_transfer_station'); 
const  user = require('../../model/users');  
var multer = require('multer');


exports.transfer = async(req,res)=>{

    const transfer = await user.find({department_name:'Transfer Station Manager'},{_id:0,id:"$_id",name:{$concat:["$first_name",'-',"$last_name"]}}).exec(); 
    return res.status(200).json({success:true,login:true,message:'Successfully completed',data:transfer});   
}  


exports.add_transfer_station = (req,res)=>
{
    const {longitude,lattitude} =  req.body;
console.log(req);
    const list = new Importtransferstation({
        user_id:req.body.user_id,
        transfer_station_userid:req.body.transfer_station_userid,
        address:req.body.address,
        longitude, 
        lattitude,  
        //image : image1
    }) 
   // console.log(list); 
    list.save((error, list) =>
    {
        if (error) return res.status(400).json({ error });
        if(list) 
        {
        res.status(200).json({list});
        }
    });
}  

var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => 
    {
      cb(null,  Date.now() + '-' + file.originalname)
    }
});

exports.upload = multer({storage: storage});