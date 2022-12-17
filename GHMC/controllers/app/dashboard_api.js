const zones=require('../../model/zones');
const wards=require("../../model/wards");
const user =require("../../model/users");
const circles =require("../../model/circles");
const useraccess=require("../../model/useraccess");
const vehicles_attandance = require('../../model/vehicles_attandance'); 
const transfer_station = require('../../model/transferstation'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;


exports.dashboard_api = async(req, res) =>  
{ 
  const { user_id,date} = req.body;
  let current_datetime = new Date();
  let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate()
     
      //console.log(formatted_date)
    
  let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
  
  let newobject ={}; 
  let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
  //console.log(user_access_data.zones); 
  let allz = user_access_data.circles;
  let u_circles =[];
  u_circles = allz.map((val)=>{
       return ObjectId(val);
  })
 
 // console.log(alldata); 
     
      let finalarray = []; 
       /* Total Vehicle */
       let total_url_1 = `http://13.233.159.132:2000/api/TotalExcel?user_id=${user_id}&date=${formatted_date}&action=total`; 
       let total_url_2 = `http://13.233.159.132:2000/api/TotalExcel?user_id=${user_id}&date=${formatted_date}&action=attend`; 
       let total_url_3 = `http://13.233.159.132:2000/api/TotalExcel?user_id=${user_id}&date=${formatted_date}&action=not_attend`; 
       let total_url_4 = `http://13.233.159.132:2000/api/TotalExcel?user_id=${user_id}&date=${formatted_date}&action=total_trips`; 
       const total_c = await vehicles_attandance.find({circles_id: {$in :u_circles},date:formatted_date}).countDocuments(); 
       const total_att = await vehicles_attandance.find({circles_id: {$in :u_circles},attandance:1,date:formatted_date}).countDocuments(); 
       const total_notatt = await vehicles_attandance.find({circles_id: {$in :u_circles},attandance:0,date:formatted_date}).countDocuments(); 
       const total_transport = await transfer_station.find({circle_id:{$in :u_circles},date:formatted_date}).countDocuments(); 
       let total_vehicle ={'tag': 'Total Vehicle Summary','total':total_c,'attend': total_att, 
       'not_attend':total_notatt, 'ts_trips': total_transport, 'total_url':total_url_1,
       'attend_url':total_url_2,'not_attend_url':total_url_3,'ts_trips_url':total_url_4};
       
       finalarray.push(total_vehicle);
      /* Total SWATCH Vehicle */
      let sat_url_1 = `http://13.233.159.132:2000/api/TotalswatchExcel?user_id=${user_id}&date=${formatted_date}&action=total`; 
      let sat_url_2 = `http://13.233.159.132:2000/api/TotalswatchExcel?user_id=${user_id}&date=${formatted_date}&action=attend`; 
      let sat_url_3 = `http://13.233.159.132:2000/api/TotalswatchExcel?user_id=${user_id}&date=${formatted_date}&action=not_attend`; 
      let sat_url_4 = `http://13.233.159.132:2000/api/TotalswatchExcel?user_id=${user_id}&date=${formatted_date}&action=total_trips`; 


       const total_c_sat = await vehicles_attandance.find({circles_id: {$in :u_circles},vehicle_type:{$in :['GHMC Swatch Auto','Private Swatch Auto'] } ,date:formatted_date}).countDocuments(); 
       const total_att_sat = await vehicles_attandance.find({circles_id: {$in :u_circles},vehicle_type:{$in :['GHMC Swatch Auto','Private Swatch Auto']}, attandance:1,date:formatted_date}).countDocuments(); 
       const total_notatt_sat = await vehicles_attandance.find({circles_id: {$in :u_circles},vehicle_type:{$in :['GHMC Swatch Auto','Private Swatch Auto']},attandance:0,date:formatted_date}).countDocuments(); 
       const total_transport_sat = await transfer_station.find({circle_id:{$in :u_circles},vehicle_type:{$in :['GHMC Swatch Auto','Private Swatch Auto']},date:formatted_date}).countDocuments(); 
       
       let total_swa_vehicle ={'tag':'Sat Vehicle Summary','total':total_c_sat,'attend':total_att_sat,'not_attend':total_notatt_sat,
    'ts_trips':total_transport_sat,'total_url':sat_url_1,'attend_url':sat_url_2,'not_attend_url':sat_url_3,'ts_trips_url':sat_url_4}
    
      finalarray.push(total_swa_vehicle);
      // NOT SWATCH VEHICLE 
      let nons_url_1 = `http://13.233.159.132:2000/api/TotalnotswatchExcel?user_id=${user_id}&date=${formatted_date}&action=total`; 
      let nons_url_2 = `http://13.233.159.132:2000/api/TotalnotswatchExcel?user_id=${user_id}&date=${formatted_date}&action=attend`; 
      let nons_url_3 = `http://13.233.159.132:2000/api/TotalnotswatchExcel?user_id=${user_id}&date=${formatted_date}&action=not_attend`; 
      let nons_url_4 = `http://13.233.159.132:2000/api/TotalnotswatchExcel?user_id=${user_id}&date=${formatted_date}&action=total_trips`; 

       const total_c_pri = await vehicles_attandance.find({circles_id: {$in :u_circles},vehicle_type:{$nin :['GHMC Swatch Auto','Private Swatch Auto'] } ,date:formatted_date}).countDocuments(); 
       const total_att_pri = await vehicles_attandance.find({circles_id: {$in :u_circles},vehicle_type:{$nin :['GHMC Swatch Auto','Private Swatch Auto']}, attandance:1,date:formatted_date}).countDocuments(); 
       const total_notatt_pri = await vehicles_attandance.find({circles_id: {$in :u_circles},vehicle_type:{$nin :['GHMC Swatch Auto','Private Swatch Auto']},attandance:0,date:formatted_date}).countDocuments(); 
       const total_transport_pri = await transfer_station.find({circle_id:{$in :u_circles},vehicle_type:{$nin :['GHMC Swatch Auto','Private Swatch Auto']},date:formatted_date}).countDocuments(); 
      
       let total_non_swa_vehicle ={'tag':'Secondary Vehicle Summary','total':total_c_pri,'attend':total_att_pri,'not_attend':total_notatt_pri,
       'ts_trips':total_transport_pri,'total_url':nons_url_1,'attend_url':nons_url_2,'not_attend_url':nons_url_3,'ts_trips_url':nons_url_4}
       
       finalarray.push(total_non_swa_vehicle);
       return res.status(200).send({success: true,login: true,
       message: "Successfully completed",data:finalarray});  
}   
 
  



