const business_type= require("../../model/business_type");
const tenents = require('../../model/tenent'); 

exports.createbusiness_type = async (req, res) => 
{
 
  const { name,status,tenent_id,user_id} = req.body;
  var t_name = await tenents.findOne({_id: tenent_id},{_id: 1, name: 1 }).exec(); 
  const list = new business_type({
    name:name,
    status:status,
    created_by: user_id, 
    tenent_id:tenent_id,
    tentent_name:t_name.name  
});  
list.save((error, list) => 
{    
    if (error) return res.status(400).json({ error });                       
    if(list) 
    {                
        res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }   
  });   
};


exports.getallbusiness_type = async (req,res)=>{     
    const alldata = await business_type.find({status:'Active'}).exec(); 
    return res.status(200).json({status:true,data:alldata});   
  }  
exports.Tenentallbusiness_type = async (req,res)=>{     
    const alldata = await business_type.find({status:'Active',tenent_id:req.body.tenent_id}).exec(); 
    return res.status(200).json({status:true,data:alldata});   
  }  


  exports.editbusiness_type = async (req,res) =>{   
    const id = req.body.id;  
    await business_type.findOne({_id:id},(err,data)=>{  
        if(err){ 
            return res.status(404).json({status:false,message:'Data not exists'});    
        }else{ 
            return res.status(200).json({status:true,data});          
        }
    })   
  }


  exports.deletebusiness_type = async (req, res) => { 
    const _id = req.body.id;    
   // console.log(id);
    const updateRecords={ 
      status:'In-active' 
    }
    await business_type.findByIdAndUpdate({_id},{...updateRecords},(err,data)=>{  
     //  console.log(data); 
        if(err){ 
            return res.status(404).json({status:false,message:'Sorry unable to delete '});   
        }else if(data == null){
            return res.status(404).json({status:false,message:'No records found to delete'});   
        }else{  
            return res.status(200).json({status:true,message:'Deleted Successfully'});   
        }
    })      
  }


  exports.updatebusiness_type = async(req,res)=>{
    const id = req.body.id;
   // console.log(id); 
    if(!id){
      return  res.status(404).json({status:false,message:'Id is required'});  
    }

    const updateRecords = {
        ...req.body, 
    }
    await business_type.findByIdAndUpdate({_id:id},{...updateRecords},(err,data)=>{  
        //  console.log(data);  
           if(err){ 
               return res.status(404).json({status:false,message:'Sorry unable to update'});   
           }else if(data == null){ 
               return res.status(404).json({status:false,message:'Invalid id'});   
           }else{   
               return res.status(200).json({status:true,message:'Updated Successfully'});   
           }
       }) 
}  