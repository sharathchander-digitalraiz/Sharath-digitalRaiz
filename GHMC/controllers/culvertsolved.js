const culvertsolved= require("../model/culvertsolved");
exports.createculvertsolved = (req, res) => 
{
  const { culvert_id,culvert_issue_id,image,date,time,user_id,status,created_by,
    log_date_created,log_date_modified,modified_by} = req.body;
 
  const list = new culvertsolved({ 
    culvert_id:culvert_id,
    culvert_issue_id: culvert_issue_id,
    image: image,
    date: date,
    time:time,
    user_id:user_id,
    status:status,
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