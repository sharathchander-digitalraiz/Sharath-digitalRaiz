const usersunique= require("../model/usersunique");
exports.createusersunique = (req, res) => 
{
  const { first_name,last_name,deparment_id,department_name,user_access_id,password,email,mobile_number,status,created_by,
    log_date_created,log_date_modified,modified_by} = req.body;
 
  const list = new usersunique({
    first_name:first_name,
    last_name: last_name,
    deparment_id: deparment_id,
    user_access_id:user_access_id,
    password: password,
    email:email,
    mobile_number:mobile_number,
    department_name:department_name,
    status:status,
    created_by:created_by,
    log_date_created:log_date_created,
    log_date_modified:log_date_modified, 
    modified_by:modified_by,
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