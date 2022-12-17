const geoscreen= require("../model/geoscreen");
exports.creategeoscreen = (req, res) => 
{
  const { name,tenent_id,status,created_by,log_date_created,log_date_modified,modified_by} = req.body;
 
  const list = new geoscreen({
    name:name,
    tenent_id: tenent_id,
    status:status,
    created_by: created_by,  
    log_date_created:log_date_created, 
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