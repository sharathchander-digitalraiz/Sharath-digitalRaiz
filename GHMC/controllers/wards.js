const wards= require("../model/wards");
exports.createwards = (req, res) => 
{
  const { wards_no,name,tenent_id,zones_id,circles_id,status,log_date_created,log_date_modified,created_by,modified_by} = req.body;
 
  const list = new wards({
    wards_no:wards_no,
    name: name,
    tenent_id: tenent_id,
    zones_id:zones_id,
    status: status,
    circles_id:circles_id,
    log_date_created:log_date_created,
    log_date_modified:log_date_modified,
    created_by:created_by,
    modified_by:modified_by
});
list.save((error, list) =>
{
    if (error) return res.status(400).json({ error });
    if(list) 
    {
      return res.status(200).json({status:true,message:'Add successfully'});      
    }
  });
};