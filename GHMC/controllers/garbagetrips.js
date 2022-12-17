const garbagetrips= require("../model/garbagetrips");
exports.creategarbagetrips = (req, res) => 
{
  const { user_id,before_image,after_image,import_gvp_bep_id,date,time,zone,circle,ward,
    landmark,vehicle_type,zone_id,circle_id,ward_id,landmark_id,created_by,log_date_created,log_date_modified,modified_by,
    latitude,longitude,type} = req.body;
 
  const list = new garbagetrips({
    user_id:user_id, 
    before_image: before_image,
    after_image: after_image,
    import_gvp_bep_id:import_gvp_bep_id,
    date: date,
    time:time,
    zone:zone,
    circle:circle,
    ward:ward,
    landmark:landmark,
    vehicle_type:vehicle_type,
    zone_id:zone_id,
    circle_id:circle_id,
    ward_id:ward_id,
    landmark_id:landmark_id,
    created_by:created_by,
    log_date_created:log_date_created,
    log_date_modified:log_date_modified,
    modified_by:modified_by,
    latitude:latitude,
    longitude:longitude,
    type:type
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