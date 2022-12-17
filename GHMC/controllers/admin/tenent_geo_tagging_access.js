const tenent_geoaccess = require('../../model/tenent_geo_tagging_access');
const tenents = require('../../model/tenent'); 
const user = require('../../model/users'); 
exports.createtenent_geoaccess = async (req, res) => 
{  
    const { geo_tag_access,status,tenent_id,user_id} = req.body;
    var t_name = await tenents.findOne({_id: tenent_id},{_id: 1, name: 1 }).exec(); 
    console.log(req.body); 
    const list = new tenent_geoaccess({ 
        status:status, 
        tenent_name: t_name.name,
        tenent_id:tenent_id,
        created_by:user_id, 
        geo_tag_access:geo_tag_access  
    })
  
    list.save(async (error, list) =>   
  {
    if (error) return res.status(404).json({ error });
    if(list) 
    {
      console.log(list);
      user.findByIdAndUpdate({_id:user_id},{user_geoaccess_id:list._id}).exec();
      res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }
  }); 
};


exports.getalltenent_geoaccess = async (req,res)=>{     
    const alldata = await tenent_geoaccess.find({status:'Active'}).exec(); 
    return res.status(200).json({status:true,data:alldata});   
  }  


  exports.edittenent_geoaccess = async (req,res) =>{   
    const id = req.body.id;  
    await tenent_geoaccess.findOne({_id:id},(err,data)=>{  
        if(err){ 
            return res.status(404).json({status:false,message:'Data not exists'});    
        }else{ 
            return res.status(200).json({status:true,data});          
        }
    })   
  }


  exports.deletetenent_geoaccess = async (req, res) => { 
    const _id = req.body.id;    
   // console.log(id);
    const updateRecords={ 
      status:'In-active' 
    }
    await tenent_geoaccess.findByIdAndUpdate({_id},{...updateRecords},(err,data)=>{  
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


  exports.updattenent_geoaccess = async(req,res)=>{
    const id = req.body.id;
    if(!id){
      return  res.status(404).json({status:false,message:'Id is required'});  
    }
   
    var t_name = await tenents.findOne({_id: req.body.tenent_id},{_id: 1, name: 1 }).exec(); 

    const updateRecords = {
        ...req.body, 
        tenent_name: t_name.name,
    }
    await tenent_geoaccess.findByIdAndUpdate({_id:id},{...updateRecords},(err,data)=>{  
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