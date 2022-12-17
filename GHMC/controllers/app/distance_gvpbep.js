const Gvpbep = require('../../model/gvpbep'); 


exports.distance_gvp = async(req,res)=>{
    
  const  {user_id,latittude,longitude} = req.body; 
  let longitude1 = parseFloat(longitude);  
  let latittude1 = parseFloat(latittude);  
 console.log(typeof(longitude1));
  console.log(req.body) 
//     const data = await Gvpbep.aggregate([
//         { 
//            $geoNear: 
//            {
//               near: { type: "Point", coordinates: [ longitude,latittude ] },
//               distanceField: "distance",
//               $maxDistance: 50,  
//            } 
//         }, 
//         {
//             $project:{ 
//                 _id : 1,  
//                 type:1,
//                 area:1,
//                 ward_name:1,
//                 landmark:1,
//                 circle:1,
//                 zone:1,  
//                 distance:1
//             }
//         }    
//      ]).exec(); 
//      console.log(data); 
//      if(data.length != '')
//      {
//         return res.status(200).json({success:true,login:true,message:"Successfully completed",found:true,data:{id:data[0]._id,type:data[0].type,
// area:data[0].area,ward_name:data[0].ward_name,landmark:data[0].landmark,circle:data[0].circle,zone:data[0].zone,distance:data[0].distance.toString()}});   
//      }
//      else
//      {
//         return res.status(400).json({success:false,login:true,message:'Not Found',found:false,data:[]});   
//      }

     return res.status(400).json({success:false,login:true,message:'Not Found',found:false,data:[]});  
         
}  