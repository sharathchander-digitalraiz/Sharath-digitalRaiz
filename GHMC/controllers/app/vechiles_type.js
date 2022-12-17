const Vehicletype = require('../../model/vechile_type');  


exports.getvehicletype = async(req,res)=>{

    const vehicletype = await Vehicletype.find({status:'Active'},{_id:1,name:1}).exec(); 
    return res.status(200).json({success:true,message:'Successfully completed',data:vehicletype});   
}  