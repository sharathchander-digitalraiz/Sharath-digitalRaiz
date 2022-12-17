const issuetype= require("../model/issuetype");
exports.createissuetype = (req, res) => 
{
  const { name,status,log_date_created,log_date_modified,created_by,modified_by} = req.body;
 
  const list = new issuetype({ 

    name: name,
    status: status,
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
      res.status(200).json({list});
    }
  });
}; 