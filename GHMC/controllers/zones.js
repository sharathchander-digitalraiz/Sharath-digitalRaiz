const zones= require("../model/zones");

exports.add_zones = (req, res) => 
{
  const { name,tenent_id,zone_no,status,log_date_created,log_date_modified,created_by,modified_by} = req.body;
 
  const list = new zones({
    name: name,
    tenent_id: tenent_id,
    status: status,
    zone_no:zone_no,
    log_date_created:log_date_created,   
    log_date_modified:log_date_modified, 
    created_by:created_by,
    modified_by:modified_by 
});
list.save((error, list) =>
{
    if (error) 
//    res.set('Access-Control-Allow-Origin', '*');
    return res.status(400).json({success:true,login:true,message:error});
    if(list) 
    {
      res.set('Access-Control-Allow-Origin', '*');
     return  res.status(200).json({success:true,login:true,message:'Added successfully'});
    }
  });
};