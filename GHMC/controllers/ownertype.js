const ownertype= require("../model/ownertype");
exports.createownertype = (req, res) => 
{
  const { name,status,log_date_modified,created_by} = req.body;
 
  const list = new ownertype({
    name:name,
    status: status,
    log_date_modified:log_date_modified, 
    created_by:created_by,  
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