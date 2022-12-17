const transferstation= require("../model/transferstation");
exports.createtransferstation = (req, res) => 
{
  const { user_id,import_data_unique_no,geo_tag_id,date,time,wastage_type,wastage_weight,image,status,
    created_by,log_date_created,log_date_modified,modified_by,zone_id,circle_id,vechile_type,zone,circle,} = req.body;
 
  const list = new transferstation({
    user_id:user_id,
    import_data_unique_no: import_data_unique_no,
    geo_tag_id: geo_tag_id,
    date:date,
    time: time,
    wastage_type:wastage_type,
    wastage_weight:wastage_weight,
    image:image,
    status:status, 
    log_date_modified:log_date_modified,  
    created_by:created_by,
    log_date_created:log_date_created, 
    modified_by:modified_by,
    zone_id:zone_id,
    circle_id:circle_id,
    vechile_type:vechile_type,
    zone:zone,
    circle:circle
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