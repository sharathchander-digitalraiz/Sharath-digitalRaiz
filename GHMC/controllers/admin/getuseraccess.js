const Useraccess = require('../../model/useraccess'); 
var multer = require('multer');


exports.getuseraccess = async (req, res) => {
   
    const useraccess = await Useraccess.aggregate([  
        {           
            $lookup:{                
                from: "tenents",             // other table name
                localField: "tenent_id",     // name of users table field
                foreignField: "_id",         // name of userinfo table field
                as: "tenent_info"            // alias for userinfo table
            } 
        },                                   // define which fields are you want to fetch 
        {   
            $unwind:"$tenent_info" 
        },  
        {     
            $project:{    
                _id : 1,    
                name : 1, 
                tenent : "$tenent_info.name",   
                geo_tag_id:1, 
                app_access_ids:1, 
                zones:1,  
                circles:1,
                ward:1,  
                landmarks:1,  
                status:1,  
                log_date_created:1,  
            } 
        }   
         // define which fields are you want to fetch  
    ]).exec();   
   // console.log(zones); 
    return res.status(200).json({status:true,message:'Success',data:useraccess});   
} 



exports.deleteuseraccess = async (req, res) => {    
    id = req.body.id;  
    await Useraccess.findByIdAndDelete({_id:id},(err,data)=>{  
        if(err){ 
            return res.status(400).json({status:false,message:'Sorry unable to delete Access'});   
        }else if(data == null){
            return res.status(400).json({status:false,message:'No records found to delete'});   
        }else{
            return res.status(200).json({status:true,message:'Deleted Successfully'});   
        }  
    }) 
   
} 
 

exports.edituseraccess = async (req,res) =>{     
    const id = req.body.id;   
    if(id){ 
    await Useraccess.findOne({_id:id},(err,data)=>{  
        if(err){
            return res.status(400).json({status:false,message:'User access not exists'});   
        }else{
            return res.status(200).json({status:true,data});     
        }   
    })   
    }else{ 
        return res.status(400).json({status:false,message:'Edit Id is required'}); 
    }
}     

  

exports.updateuseraccess = async (req,res) =>{      
    const _id = req.body.id;  
    const updateRecords = { 
        ...req.body
    }       
    await Useraccess.findByIdAndUpdate({_id},{...updateRecords},(err,data)=>{
        console.log(data); 
        if(err){     
            return res.status(400).json({status:false,message:'Sorry unable to update '});     
        }else if(data == null){
            return res.status(400).json({status:false,message:'Sorry unable to update '});     
        }else if(data){ 
            return res.status(200).json({status:true,message:'updated successfully'}); 
        } 
    })  
} 
  


var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    { 
      cb(null, './uploads/transfer_station/original/'); 
    }, 
    filename: (req, file, cb) => 
    {
      cb(null,  Date.now() + '-' + file.originalname);
    }
});

exports.upload = multer({storage: storage});


 
        

                  

 
