const Notifications= require("../../model/notification_collection");
const multer = require('multer'); 
const useraccess=require("../../model/useraccess");
const user=require("../../model/users");
var fcm = require('../../ghmc-d1ce3-firebase-adminsdk-rzx4i-1e660e2680.json');
//var fcm = "";
var url= require('../../ghmc-d1ce3-firebase-adminsdk-rzx4i-1e660e2680.json');



exports.createnotification = (req, res) => 
{
  const { user_id,title,description,zones_id,circles_id,ward_id,landmark_id,area_id } = req.body;
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let dateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds; 
  console.log(req.file.filename)
  const list = new Notifications({  
    date: dateTime,
    user_id: user_id,
    title: title, 
    description: description,
    zones_id:'',
    circles_id:'',
    ward_id: '', 
    landmark_id:'',
    area_id: '',
    image_url: 'uploads/notification/'+req.file.filename
 });    


 list.save((error, data) =>   
{  
    if (error) return res.status(400).json({ error });
    if(data)  
    {       
      res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }
  });    
};  


exports.listofnotifications = async(req,res)=>{
    const {user_id} = req.body;
    console.log(req.body); 
    const notification_details = await Notifications.find({user_id:user_id,status:'Active'}).exec();
    const send_notification = [];

    var diff = new Date() - new Date('2021-12-07 12:1:22') ;
    const milliseconds = diff; 
    const hours = milliseconds / 36e5; 


    await Promise.all(notification_details.map( async(note)=>{
            let note_obj ={};
            note_obj['id'] = note._id;
            note_obj['title'] = note.title;
            note_obj['description'] = note.description;
            note_obj['image_url'] = note.image_url; 
            var diff = new Date() - new Date(note.date) ;
            const milliseconds = diff; 
            const hours = milliseconds / 36e5; 
            console.log(hours); 
            let time; 
            if(hours <= 0.10){
                 time = 'Just now'
            }else if(hours >= 0.50 && hours <= 0.50){ 
                 time = '30 mins Just now' 
            }   
            else if(hours >= 0.50 && hours <= 1){ 
                time = '1hr Just back' 
            }else{ 
                time = 'Long back' 
            }  
            note_obj['time'] = time; 
            send_notification.push(note_obj); 
    }));
     
    return res.status(200).send({login:true,success:true,data: send_notification})
}




exports.tenent_notifications = async(req,res)=>{
  const {user_id,tenent_id} = req.body;
  console.log(req.body);
  const notification_details = await Notifications.find({tenent_id:tenent_id}).exec();
  console.log(notification_details);
  const send_notification = [];
  await Promise.all(notification_details.map( async(note)=>{
          let note_obj ={};
          note_obj['id'] = note._id;
          note_obj['title'] = note.title;
          note_obj['description'] = note.description;
          note_obj['image_url'] = note.image_url; 
          send_notification.push(note_obj); 
  }));
   
  return res.status(200).send({login:true,success:true,data: send_notification})
}


exports.deletenotification = async(req,res)=>{
    const {id} = req.body; 
    await Notifications.findByIdAndUpdate(
        { _id: id },
        { status: "Inactive" },(err,result)=>{
            if (err) {
                res.status(400).send({login:true,status:false,message:'Something went wrong'});
              } else {
                res.status(200).send({login:true,status:true,message:'Deleted successfully'});
              }
        }); 
}

exports.delete_notification = async(req,res)=>{
  const {id} = req.body; 
      await Notifications.findByIdAndDelete({_id:id},(err,data)=>{  
        //  console.log(data); 
           if(err){ 
               return res.status(400).json({status:false,login:true,message:'Sorry unable to delete area'});   
           }else if(data == null){
               return res.status(400).json({status:false,login:true,message:'No records found to delete'});   
           }else{ 
               return res.status(200).json({status:true,login:true,message:'Deleted Successfully'});   
           }
       })      
}


exports.send_notification = async(req,res)=>{
 // var FCM = new fcm(url);
  const {title,description,zones_id,circles_id,wards_id,area_id,tenent_id} = req.body;
  console.log(req.body);
  let condition={};
  if(zones_id!='all')
  {
    condition.zones=zones_id;
  }
  if(circles_id!='all')
  {
    condition.circles=circles_id;
  }
  if(wards_id!='all')
  {
    condition.ward=wards_id;
  }
  if(area_id!='all')
  {
    condition.areas=area_id;
  }
  condition.tenent_id=tenent_id;
  console.log(condition);
  var user_acces_data= await useraccess.find(condition).exec();
  console.log(user_acces_data);
  await Promise.all(user_acces_data.map( async(note)=>{
    var user_acces_data= await user.findOne({user_access_id:note._id}).exec();
    console.log(user_acces_data);
    // var message = {
    //         data: 
    //         {
    //             score: '850',
    //             time: '2:45'
    //         },
    //         notification:
    //         {
    //           title : title,
    //           body : description,
    //           image:req.file.filename
    //         },
    //         token :user_acces_data.fcm_token
    // };
    // FCM.send(message, function(err, response)
    // {
    // if(err)
    // {
    //     console.log('error found', err);
    // }
    // else 
    // {
    //     let date_ob = new Date();
    //     let date = ("0" + date_ob.getDate()).slice(-2);
    //     let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    //     let year = date_ob.getFullYear();
    //     let hours = date_ob.getHours();
    //     let minutes = date_ob.getMinutes();
    //     let seconds = date_ob.getSeconds();

    //     let dateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds; 
    //     const list = new Notifications({  
    //       date: dateTime,
    //       user_id: user_acces_data._id,
    //       title: title, 
    //       description: description,
    //       image_url: 'uploads/notification/'+req.file.filename,
    //       tenent_id:user_acces_data.tenent_id
    //   });  
      
    //   list.save((error, data) =>   
    //   {  
    //       // if (error) return res.status(400).json({ error });
    //       // if(data)  
    //       // {       
          
    //       // }
    //     });   
    // }
    // });
  }));
  res.status(200).json({success: true, login: true, message: 'Saved successfully' });
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    {
      cb(null, './uploads/notification/')
    },
    filename: (req, file, cb) =>   
    {
      cb(null,  Date.now() + '-' + file.originalname)
    }
  }); 
  
  exports.upload_notification = multer({storage: storage}); 