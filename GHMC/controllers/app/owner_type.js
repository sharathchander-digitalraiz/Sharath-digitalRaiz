const Ownertype = require('../../model/ownertype');  


exports.owner_type = async(req,res)=>{

    const vehicletype = await Ownertype.find({status:'Active'},{_id:1,name:1}).exec(); 
    return res.status(200).json({success:true,message:'Successfully completed',data:vehicletype});   
}   



exports.dash_vechiles_type = async(req,res)=>
{
    return res.status(200).json({success:true,login:true,message:'Successfully completed',data:[{
        id: "all",
        name: "all"
    },
    {
        id: "0",
        name: "Sat Vehicles"
    },
    {
        id: "1",
        name: "Transport Vehicles"
    }]});   
}