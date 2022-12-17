const culvert= require("../model/culvert");
exports.createculvert = (req, res) => 
{
  const { name,zone_id,circle_id,ward_id,landmark_id,area_id,area,zone,circle,ward,landmark,
    unique_no,qr_code_view,type,user_id,latittude,longitude,location,status,log_date_created,date,
    created_by,log_date_modified,modified_by} = req.body;
 
  const list = new culvert({
    name:name,
    zone_id: zone_id,
    circle_id: circle_id,
    ward_id:ward_id,
    landmark_id: landmark_id,
    area_id:area_id,
    area:area,
    zone:zone,
    circle:circle,
    ward:ward,
    landmark:landmark,
    unique_no:unique_no,
    qr_code_view:qr_code_view,
    type:type,
    user_id:user_id,
    latittude:latittude,
    longitude:longitude,
    location:location,
    status:status,
    log_date_created:log_date_created,
    date:date,
    created_by:created_by,
    log_date_modified:log_date_modified,
    modified_by:modified_by
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