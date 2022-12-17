const house_type= require("../../model/house_type");
const tenents = require('../../model/tenent'); 

exports.createhouse_type = async (req, res) => 
{
 
  const { name,status,tenent_id,user_id} = req.body;
  var t_name = await tenents.findOne({_id: tenent_id},{_id: 1, name: 1 }).exec(); 
  const list = new house_type({
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


exports.getallhouse_type = async (req,res)=>{     
    const alldata = await house_type.find({status:'Active'}).exec(); 
    return res.status(200).json({status:true,data:alldata});   
  }  
exports.Tenentallhouse_type = async (req,res)=>{     
    const alldata = await house_type.find({status:'Active',tenent_id:req.body.tenent_id}).exec(); 
    return res.status(200).json({status:true,data:alldata});   
  }  


  exports.edithouse_type = async (req,res) =>{   
    const id = req.body.id;  
    await house_type.findOne({_id:id},(err,data)=>{  
        if(err){ 
            return res.status(404).json({status:false,message:'Data not exists'});    
        }else{ 
            return res.status(200).json({status:true,data});          
        }
    })   
  }


  exports.deletehouse_type = async (req, res) => { 
    const _id = req.body.id;    
   // console.log(id);
    const updateRecords={ 
      status:'In-active' 
    }
    await house_type.findByIdAndUpdate({_id},{...updateRecords},(err,data)=>{  
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


  exports.updatehouse_type = async(req,res)=>{
    const id = req.body.id;
   // console.log(id); 
    if(!id){
      return  res.status(404).json({status:false,message:'Id is required'});  
    }

    const updateRecords = {
        ...req.body, 
    }
    await house_type.findByIdAndUpdate({_id:id},{...updateRecords},(err,data)=>{  
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