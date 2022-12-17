const circles= require("../model/circles");
exports.createcircles = (req, res) => 
{
  const { circle_no,name,tenent_id,zones_id,status,log_date_created,log_date_modified,created_by,modified_by} = req.body;
 
  const list = new circles({
    circle_no:circle_no,
    name: name,
    tenent_id: tenent_id,
    zones_id:zones_id,
    status: status,
    log_date_created:log_date_created,
    log_date_modified:log_date_modified,
    created_by:created_by,
    modified_by:modified_by
});
list.save((error, list) =>
{
    if (error) return res.status(400).json({status:'false',login:true,message:error});
    if(list) 
    {
      res.status(200).json({status:'true',login:true,message:'Saved successfully'});
    }
  });
};