const accesslogdetails= require("../model/access_log_details");
exports.createaccesslogdetails = (req, res) => 
{
  const { user_id,login_time,logout_time,session,ip_address,location,token,logout} = req.body;
 
  const list = new accesslogdetails({
    user_id:user_id,
    login_time: login_time,
    logout_time: '',
    session:session,
    ip_address: ip_address,
    location:location, 
    token:token,
    logout:logout
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