const tenent= require("../model/tenent");
var multer = require('multer');
exports.createtenent = (req, res) => 
{
  console.log(req.file);
  console.log("req");
  const { name,status,log_date_created,log_date_modified,created_by,modified_by,city,district,state} = req.body;
  let image =req.file.path;
  
  const tene = new tenent({
    name: name,
    status: status,
    log_date_created:log_date_created,
    log_date_modified:log_date_modified,
    created_by:created_by,
    modified_by:modified_by,
    city:city,
    district:district,
    state:state,
    image:image
});
tene.save((error, tene) =>
{
    if (error) return res.status(400).json({ error });
    if(tene) 
    {
      res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }
  });
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    cb(null, './uploads/tenent')
  },
  filename: (req, file, cb) => 
  {
    cb(null,  Date.now() + '-' + file.originalname)
  }
});

exports.uploadTenent = multer({storage: storage});