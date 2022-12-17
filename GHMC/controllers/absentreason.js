const absentreason= require("../model/absentreason");
exports.createabsentreason = (req, res) => 
{
  const { vehicle_id,user_id,comment,reason,date,created_by,log_date_created,log_date_modified,modified_by} = req.body;
 
  const list = new absentreason({
    vehicle_id:vehicle_id,
    user_id: user_id, 
    comment: comment,
    reason:reason,
    date: date,
    created_by:created_by,
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