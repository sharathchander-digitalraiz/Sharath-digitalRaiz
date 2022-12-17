const owner_type = require('../../model/ownertype');
const tenents = require('../../model/tenent'); 
exports.createowner_type = async (req, res) => 
{  
    const { name,status,tenent_id,user_id} = req.body;
    var t_name = await tenents.findOne({_id: tenent_id},{_id: 1, name: 1 }).exec(); 
   
    const list = new owner_type({ 
        name:name, 
        status:status, 
        tenent_name: t_name.name,
        tenent_id:tenent_id,
        created_by:user_id
    })

    list.save((error, list) =>  
  {
    if (error) return res.status(404).json({ error });
    if(list) 
    {
      res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }
  }); 
};


exports.getallowner_type = async (req,res)=>{   
  //  const {tenent_id} = req.body;
    const alldata = await owner_type.find({status:'Active'}).exec(); 
    return res.status(200).json({status:true,data:alldata});   
  }  
  
  exports.TenentAllowner_type = async (req,res)=>{   
      const {tenent_id} = req.body;
      const alldata = await owner_type.find({status:'Active',tenent_id:tenent_id}).exec(); 
      return res.status(200).json({status:true,data:alldata});   
    }  

  exports.editowner_type = async (req,res) =>{   
    const id = req.body.id;  
    await owner_type.findOne({_id:id},(err,data)=>{  
        if(err){ 
            return res.status(404).json({status:false,message:'Data not exists'});    
        }else{ 
            return res.status(200).json({status:true,data});          
        }
    })   
  }


  exports.deleteowner_type = async (req, res) => { 
    const _id = req.body.id;    
   // console.log(id);
    const updateRecords={ 
      status:'In-active' 
    }
    await owner_type.findByIdAndUpdate({_id},{...updateRecords},(err,data)=>{  
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


  exports.updateowner_type = async(req,res)=>{
    const id = req.body.id;
    if(!id){
      return  res.status(404).json({status:false,message:'Id is required'});  
    }

    const updateRecords = {
        ...req.body, 
    }
    await owner_type.findByIdAndUpdate({_id:id},{...updateRecords},(err,data)=>{  
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