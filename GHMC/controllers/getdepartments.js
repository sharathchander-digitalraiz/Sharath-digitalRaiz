const Departments = require('../model/department'); 
    
exports.getdepartments = async(req,res)=>{

    // const department = await Departments.aggregate([
    //     {
    //         $lookup:{
    //             from: "users",       // other table name
    //             localField: "created_by",   // name of users table field
    //             foreignField: "_id", // name of userinfo table field
    //             as: "created_user"         // alias for userinfo table
    //         }   
    //     },
    //     {   $unwind:"$created_user" },     
    //     {   
    //         $project:{    
    //             _id : 1,    
    //             name : 1,    
    //             created : "$created_user.last_name"  
    //         } 
    //     }
    // ]).exec(); 
    // res.set('Access-Control-Allow-Origin', '*');
    const department = await Departments.find({}).exec(); 
    return res.status(200).json({status:true,message:'Success',data:department});   
}   
  

exports.editdepartments = async (req,res) =>{    
    const id = req.body.id;    
   
    await Departments.findOne({_id:id},{_id:1,name:true},(err,data)=>{   
        if(err){
            return res.status(400).json({status:false,message:'Sorry something went wrong'});    
        }else{
            return res.status(200).json({status:true,data});    
        }
    }) 
}  

exports.deletedepartment = async (req, res) => {    
    id = req.body.id;  
    await Departments.findByIdAndDelete({_id:id},(err,data)=>{
        if(err){  
            return res.status(400).json({status:false,message:'Sorry unable to delete'});   
        }else if(data == null){
            return res.status(400).json({status:false,message:'No records found to delete'});    
        }else{
            res.set('Access-Control-Allow-Origin', '*');
            return res.status(200).json({status:true,message:'Deleted Successfully'});   
        }  
    })  
    
}        

   

exports.updatedepartment = async (req,res) =>{ 
   
    const _id = req.body.id; 
    if(_id){
    const updateRecords = {  
        ...req.body, 
        modified_by: req.user.user_id,        
        log_date_modified: new Date()                
    }     
      
    await Departments.findByIdAndUpdate({_id},{...updateRecords},(err,data)=>{     
        if(err){   
            return res.status(400).json({status:false,message:'Sorry unable to update '});
        }else if(data == null){  
            return res.status(400).json({status:false,message:'Sorry unable to update '});
        }else if(data){  
            return res.status(200).json({status:true,message:'Updated successfully'});
        } 
    })   
   }else{  
    return res.status(400).json({status:false,message:'Tenent Id is required'});
   } 

   
}  
  