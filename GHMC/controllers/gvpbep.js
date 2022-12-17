const gvpbep= require("../model/gvpbep");
exports.creategvpbep = (req, res) => 
{
  const { zone,circle,ward_no,ward_name,incharge,designation,mobile_number,area,landmark,location,
    latitude,longitude,zone_id,circle_id,ward_id,landmark_id,status,created_by,log_date_created,log_date_modified,
    modified_by,type,user_id} = req.body;
 
  const list = new gvpbep({
    zone:zone,
    circle: circle,
    ward_no: ward_no, 
    ward_name:ward_name,  
    incharge: incharge, 
    designation:designation,  
    mobile_number:mobile_number,
    area:area,
    landmark:landmark,
    location:location,
    latitude:latitude,
    longitude:longitude,
    zone_id:zone_id,
    circle_id:circle_id,
    ward_id:ward_id,
    landmark_id:landmark_id,
    status:status,
    created_by:created_by,
    log_date_created:log_date_created,
    log_date_modified:log_date_modified,
    modified_by:modified_by,
    type:type,
    user_id:user_id
}); 
list.save((error, list) =>
{
    if (error) return res.status(400).json({ error });
    if(list) 
    {
      res.status(200).json({list});
    }
  });
};