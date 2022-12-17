const culvertissue= require("../model/culvertissue");
exports.createculvertissue = (req, res) => 
{
  const { date,time,culvert_id,type,isse_type_id,image,zone_id,circle_id,ward_id,landmark_id,area_id,
    area,zone,circle,ward,landmark,status,user_id,log_date_created,created_by,log_date_modified,
    modified_by} = req.body;
 
  const list = new culvertissue({
    date:date,
    time: time,
    culvert_id: culvert_id,
    type: type,
    isse_type_id: isse_type_id,
    image: image,
    zone_id: zone_id,
    circle_id: circle_id,
    ward_id: ward_id,
    landmark_id: landmark_id,
    area_id: area_id,
    area: area,
    zone: zone,
    circle: circle, 
    ward: ward,
    landmark: landmark,
    status: status,
    user_id: user_id,
    log_date_created: log_date_created,
    created_by: created_by,
    log_date_modified: log_date_modified,
    modified_by: modified_by
   
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