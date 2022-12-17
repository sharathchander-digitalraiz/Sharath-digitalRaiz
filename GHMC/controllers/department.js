const department= require("../model/department");
exports.createdepartment = (req, res) => 
{
  const { name,status,log_date_created,log_date_modified,modified_by,created_by} = req.body;
  const list = new department({
    name:name,
    status:status,
    created_by: created_by,     
    log_date_created:log_date_created,    
    log_date_modified:log_date_modified, 
    modified_by:modified_by 
});                                                                     
list.save((error, list) =>                                              
{         
    console.log(error);
    if (error) return res.status(400).json({status:true,login:true,message:"Something went wrong.please try again"});            
    if(list) 
    {
      console.log('Access');    
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).json({status:true,login:true,message:"Successfully added"});
    }
  });  
};