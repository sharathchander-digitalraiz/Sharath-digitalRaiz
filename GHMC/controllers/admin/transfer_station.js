const Vehicles_attandances = require('../../model/vehicles_attandance'); 
const User =require("../../model/users");
const Department = require('../../model/department'); 
const Useraccess=require("../../model/useraccess");
const Zone = require("../../model/zones");
const vehicles = require("../../model/vehicles");
const transfer_staion=require("../../model/transferstation");
var Mongoose = require('mongoose');
var multer = require('multer');
// const { access } = require('fs/promises');
var ObjectId = Mongoose.Types.ObjectId;

exports.gettransfer_station_report = async(req,res)=>{

    const { user_id,tenent_id } = req.body; 
        
        let current_datetime = new Date();
        let s = new String(current_datetime.getDate());
        let cd; 	
        if(s.length == 1)
        {
            cd = '0'+s;
        }
        else
        {
            cd = current_datetime.getDate(); 
        } 
        let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;

        let acc_dep_data = await User.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec(); 
        //console.log(acc_dep_data); 
        let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
      //  console.log(role_data);
        if(role_data.name == 'Admin')
        {
            let newobject = {}; 
          //  newobject.tenent_id = ObjectId('618f8d2f7bf1ba171f8f35da'); 
         
         // let  tenent_id = ObjectId(tenent_id); 
            date = formatted_date; 
            let vehicles_list = await vehicles.find({tenent_id:tenent_id}).exec();
            console.log(vehicles_list);
            const res_data=await Promise.all(vehicles_list.map(async (vehicleslist) => 
            {
                console.log(vehicleslist.unique_no);
                let response_data={};
                response_data["zone"]=vehicleslist.zone;
                response_data["circle"]=vehicleslist.circle_no+vehicleslist.circle;
                response_data["wards"]=vehicleslist.wards_no+vehicleslist.ward_name;
                response_data["area"]=vehicleslist.location;
                response_data["landmark"]="";
                response_data["Vechile_type"]=vehicleslist.vehicle_type;
                response_data["vehicle_no"]=vehicleslist.vehicle_registration_number;
                response_data["driver_name"]=vehicleslist.driver_name;
                response_data["driver_mobile"]=vehicleslist.driver_number;
                console.log(formatted_date);
                let vehicles_count = await transfer_staion.find({import_data_unique_no:vehicleslist.unique_no,date:formatted_date}).countDocuments();
                 console.log(vehicles_count);
                if(vehicles_count>0)
                {
                    let vehicles_scan = await transfer_staion.find({import_data_unique_no:vehicleslist.unique_no,date:formatted_date}).exec();
                    let users_list = await User.findOne({_id:vehicles_scan[0].user_id}).exec();
                    response_data["transfer_station_name1"]=(users_list.username!="")?users_list.username:'-';
                    response_data["date_time1"]=(vehicles_scan[0].date!="")?vehicles_scan[0].date:"-";
                    response_data["weight1"]=(vehicles_scan[0].wastage_weight!="")?vehicles_scan[0].wastage_weight:'-';
                    response_data["image1"]="";
                    response_data["trips_count1"]=vehicles_count;
                    if(vehicles_count>1)
                    {
                        let users_list_one = await User.findOne({_id:vehicles_scan[1].user_id}).exec();
                        response_data["transfer_station_name2"]=(users_list_one.username!="")?users_list_one.username:'-';
                        response_data["date_time2"]=(vehicles_scan[1].date!="")?vehicles_scan[1].date:"-";
                        response_data["weight2"]=(vehicles_scan[1].wastage_weight!="")?vehicles_scan[1].wastage_weight:'-';
                        response_data["image2"]="";
                        response_data["trips_count2"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name2"]="-";
                        response_data["date_time2"]="-";
                        response_data["weight2"]="-";
                        response_data["image2"]="-";
                        response_data["trips_count2"]='-';
                    }

                    if(vehicles_count>2)
                    {
                        let users_list_two = await User.findOne({_id:vehicles_scan[2].user_id}).exec();
                        response_data["transfer_station_name3"]=(users_list_two.username!="")?users_list_two.username:'-';
                        response_data["date_time3"]=(vehicles_scan[2].date!="")?vehicles_scan[2].date:"-";
                        response_data["weight3"]=(vehicles_scan[2].wastage_weight!="")?vehicles_scan[2].wastage_weight:'-';
                        response_data["image3"]="";
                        response_data["trips_count3"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name3"]="-";
                        response_data["date_time3"]="-";
                        response_data["weight3"]="-";
                        response_data["image3"]="-";
                        response_data["trips_count3"]='-';
                    }

                    if(vehicles_count>3)
                    {
                        let users_list_two = await User.findOne({_id:vehicles_scan[2].user_id}).exec();
                        response_data["transfer_station_name4"]=(users_list_two.username!="")?users_list_two.username:'-';
                        response_data["date_time4"]=(vehicles_scan[2].date!="")?vehicles_scan[2].date:"-";
                        response_data["weight4"]=(vehicles_scan[2].wastage_weight!="")?vehicles_scan[2].wastage_weight:'-';
                        response_data["image4"]="";
                        response_data["trips_count4"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name4"]="-";
                        response_data["date_time4"]="-";
                        response_data["weight4"]="-";
                        response_data["image4"]="-";
                        response_data["trips_count4"]='-';
                    }

                    if(vehicles_count>4)
                    {
                        let users_list_five = await User.findOne({_id:vehicles_scan[4].user_id}).exec();
                        response_data["transfer_station_name5"]=(users_list_five.username!="")?users_list_five.username:'-';
                        response_data["date_time5"]=(vehicles_scan[4].date!="")?vehicles_scan[4].date:"-";
                        response_data["weight5"]=(vehicles_scan[4].wastage_weight!="")?vehicles_scan[4].wastage_weight:'-';
                        response_data["image5"]="";
                        response_data["trips_count5"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name4"]="-";
                        response_data["date_time5"]="-";
                        response_data["weight5"]="-";
                        response_data["image5"]="-";
                        response_data["trips_count5"]='-';
                    }


                    if(vehicles_count>5)
                    {
                        let users_list_six = await User.findOne({_id:vehicles_scan[5].user_id}).exec();
                        response_data["transfer_station_name6"]=(users_list_six.username!="")?users_list_six.username:'-';
                        response_data["date_time6"]=(vehicles_scan[5].date!="")?vehicles_scan[5].date:"-";
                        response_data["weight6"]=(vehicles_scan[5].wastage_weight!="")?vehicles_scan[5].wastage_weight:'-';
                        response_data["image6"]="";  
                        response_data["trips_count6"]=vehicles_count;  
                    }
                    else 
                    {
                        response_data["transfer_station_name6"]="-";
                        response_data["date_time6"]="-";
                        response_data["weight6"]="-";
                        response_data["image6"]="-";
                        response_data["trips_count6"]='-';
                    }
                }
                else
                {
                    response_data["transfer_station_name1"]="-";
                    response_data["date_time1"]="-";
                    response_data["weight1"]="-";
                    response_data["image1"]="-";
                    response_data["trips_count1"]='-';

                    response_data["transfer_station_name2"]="-";
                    response_data["date_time2"]="-";
                    response_data["weight2"]="-";
                    response_data["image2"]="-";
                    response_data["trips_count2"]='-';

                    response_data["transfer_station_name3"]="-";
                    response_data["date_time3"]="-";
                    response_data["weight3"]="-";
                    response_data["image3"]="-";
                    response_data["trips_count3"]='-';

                    response_data["transfer_station_name4"]="-";
                    response_data["date_time4"]="-";
                    response_data["weight4"]="-";
                    response_data["image4"]="-";
                    response_data["trips_count4"]='-';

                    response_data["transfer_station_name5"]="-";
                    response_data["date_time5"]="-";
                    response_data["weight5"]="-";
                    response_data["image5"]="-";
                    response_data["trips_count5"]='-';


                    response_data["transfer_station_name6"]="-";
                    response_data["date_time6"]="-";
                    response_data["weight6"]="-";
                    response_data["image6"]="-";
                    response_data["trips_count6"]='-';
                }
                return response_data;
            }));
            if(res_data.length>0)
            {
                var keys = Object.keys(res_data[0]);
            }
           else
           {
               var keys =[];
           }
          //  console.log(res_data);  
           return res.status(200).send({login:true,status:true,data:res_data,keys:keys}); 
        }
        else
        {
            const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
            date = formatted_date; 
            console.log("access_data.zones");
            console.log(access_data.zones);
            console.log("access_data.circles");
            console.log(access_data.circles);
            console.log("access_data.circles");
            console.log(access_data.ward);
            let vehicles_list = await vehicles.find({tenent_id:tenent_id,zones_id:access_data.zones,
                circles_id:access_data.circles,ward_id:access_data.ward}).exec();
            const res_data=await Promise.all(vehicles_list.map(async (vehicleslist) => 
            {
              //  console.log('a'+vehicleslist); 
                let response_data={};
                response_data["zone"]=vehicleslist.zone;
                response_data["circle"]=vehicleslist.circle_no+vehicleslist.circle;
                response_data["wards"]=vehicleslist.wards_no+vehicleslist.ward_name;
                response_data["area"]=vehicleslist.location;
                response_data["landmark"]="";
                response_data["Vechile_type"]=vehicleslist.vehicle_type;
                response_data["vehicle_no"]=vehicleslist.vehicle_registration_number;
                response_data["driver_name"]=vehicleslist.driver_name;
                response_data["driver_mobile"]=vehicleslist.driver_number;
               // console.log(formatted_date);
                let vehicles_count = await transfer_staion.find({import_data_unique_no:vehicleslist.unique_no,date:formatted_date}).countDocuments();
                 console.log(vehicles_count);
                if(vehicles_count>0)
                {
                    let vehicles_scan = await transfer_staion.find({import_data_unique_no:vehicleslist.unique_no,date:formatted_date}).exec();
                    let users_list = await User.findOne({_id:vehicles_scan[0].user_id}).exec();
                    response_data["transfer_station_name1"]=(users_list.username!="")?users_list.username:'-';
                    response_data["date_time1"]=(vehicles_scan[0].date!="")?vehicles_scan[0].date:"-";
                    response_data["weight1"]=(vehicles_scan[0].wastage_weight!="")?vehicles_scan[0].wastage_weight:'-';
                    response_data["image1"]="";
                    response_data["trips_count1"]=vehicles_count;
                    if(vehicles_count>1)
                    {
                        let users_list_one = await User.findOne({_id:vehicles_scan[1].user_id}).exec();
                        response_data["transfer_station_name2"]=(users_list_one.username!="")?users_list_one.username:'-';
                        response_data["date_time2"]=(vehicles_scan[1].date!="")?vehicles_scan[1].date:"-";
                        response_data["weight2"]=(vehicles_scan[1].wastage_weight!="")?vehicles_scan[1].wastage_weight:'-';
                        response_data["image2"]="";
                        response_data["trips_count2"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name2"]="-";
                        response_data["date_time2"]="-";
                        response_data["weight2"]="-";
                        response_data["image2"]="-";
                        response_data["trips_count2"]='-';
                    }

                    if(vehicles_count>2)
                    {
                        let users_list_two = await User.findOne({_id:vehicles_scan[2].user_id}).exec();
                        response_data["transfer_station_name3"]=(users_list_two.username!="")?users_list_two.username:'-';
                        response_data["date_time3"]=(vehicles_scan[2].date!="")?vehicles_scan[2].date:"-";
                        response_data["weight3"]=(vehicles_scan[2].wastage_weight!="")?vehicles_scan[2].wastage_weight:'-';
                        response_data["image3"]="";
                        response_data["trips_count3"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name3"]="-";
                        response_data["date_time3"]="-";
                        response_data["weight3"]="-";
                        response_data["image3"]="-";
                        response_data["trips_count3"]='-';
                    }

                    if(vehicles_count>3)
                    {
                        let users_list_two = await User.findOne({_id:vehicles_scan[2].user_id}).exec();
                        response_data["transfer_station_name4"]=(users_list_two.username!="")?users_list_two.username:'-';
                        response_data["date_time4"]=(vehicles_scan[2].date!="")?vehicles_scan[2].date:"-";
                        response_data["weight4"]=(vehicles_scan[2].wastage_weight!="")?vehicles_scan[2].wastage_weight:'-';
                        response_data["image4"]="";
                        response_data["trips_count4"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name4"]="-";
                        response_data["date_time4"]="-";
                        response_data["weight4"]="-";
                        response_data["image4"]="-";
                        response_data["trips_count4"]='-';
                    }

                    if(vehicles_count>4)
                    {
                        let users_list_five = await User.findOne({_id:vehicles_scan[4].user_id}).exec();
                        response_data["transfer_station_name5"]=(users_list_five.username!="")?users_list_five.username:'-';
                        response_data["date_time5"]=(vehicles_scan[4].date!="")?vehicles_scan[4].date:"-";
                        response_data["weight5"]=(vehicles_scan[4].wastage_weight!="")?vehicles_scan[4].wastage_weight:'-';
                        response_data["image5"]="";
                        response_data["trips_count5"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name4"]="-";
                        response_data["date_time5"]="-";
                        response_data["weight5"]="-";
                        response_data["image5"]="-";
                        response_data["trips_count5"]='-';
                    }


                    if(vehicles_count>5)
                    {
                        let users_list_six = await User.findOne({_id:vehicles_scan[5].user_id}).exec();
                        response_data["transfer_station_name6"]=(users_list_six.username!="")?users_list_six.username:'-';
                        response_data["date_time6"]=(vehicles_scan[5].date!="")?vehicles_scan[5].date:"-";
                        response_data["weight6"]=(vehicles_scan[5].wastage_weight!="")?vehicles_scan[5].wastage_weight:'-';
                        response_data["image6"]="";    
                        response_data["trips_count6"]=vehicles_count;
                    }
                    else 
                    {
                        response_data["transfer_station_name6"]="-";
                        response_data["date_time6"]="-";
                        response_data["weight6"]="-";
                        response_data["image6"]="-";
                        response_data["trips_count6"]='-';
                    }
                }
                else
                {
                    response_data["transfer_station_name1"]="-";
                    response_data["date_time1"]="-";
                    response_data["weight1"]="-";
                    response_data["image1"]="-";
                    response_data["trips_count1"]='';

                    response_data["transfer_station_name2"]="-";
                    response_data["date_time2"]="-";
                    response_data["weight2"]="-";
                    response_data["image2"]="-";
                    response_data["trips_count2"]='-';

                    response_data["transfer_station_name3"]="-";
                    response_data["date_time3"]="-";
                    response_data["weight3"]="-";
                    response_data["image3"]="-";
                    response_data["trips_count3"]='-';

                    response_data["transfer_station_name4"]="-";
                    response_data["date_time4"]="-";
                    response_data["weight4"]="-";
                    response_data["image4"]="-";
                    response_data["trips_count4"]='-';


                    response_data["transfer_station_name5"]="-";
                    response_data["date_time5"]="-";
                    response_data["weight5"]="-";
                    response_data["image5"]="-";
                    response_data["trips_count5"]='-';

                    response_data["transfer_station_name6"]="-";
                    response_data["date_time6"]="-";
                    response_data["weight6"]="-";
                    response_data["image6"]="-";
                    response_data["trips_count6"]='-';
                }
                return response_data;
            }));
            if(res_data.length>0)
            {
                var keys = Object.keys(res_data[0]);
            }
           else
           {
               var keys =["zone","circle","wards","area","landmark","Vechile_type","vehicle_no","driver_name",
               "driver_mobile","transfer_station_name1","date_time1","weight1","image1","trips_count1",
               "transfer_station_name2","date_time2","weight2","image2","trips_count2","transfer_station_name3",
               "date_time3","weight3","image3","trips_count3","transfer_station_name4","date_time4","weight4","image4",
               "trips_count4","date_time5","weight5","image5","trips_count5","transfer_station_name6","date_time6","weight6",
               "image6","trips_count6"];
           }
           return res.status(200).send({login:true,status:true,data:res_data,keys:keys}); 
        }
} 
exports.gettransfer_station_search_report = async(req,res)=>{
    console.log(req.body); 
    const { user_id,tenent_id,vehicle_type,zone_id,circle_id,ward_id,from_date,to_date } = req.body; 
        
        let current_datetime = new Date();
        let s = new String(current_datetime.getDate());
        let cd; 	
        if(s.length == 1)
        {
            cd = '0'+s;
        }
        else
        {
            cd = current_datetime.getDate(); 
        } 
        let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;

        let acc_dep_data = await User.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec(); 
        //console.log(acc_dep_data); 
        let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
            let newobject = {}; 
          //  newobject.tenent_id = ObjectId('618f8d2f7bf1ba171f8f35da'); 
          if(tenent_id!="")
          {
            newobject.tenent_id=tenent_id;
          }
          if(vehicle_type!="All" && vehicle_type!=undefined)
          {
            newobject.vehicle_type_id=vehicle_type;
          }
          if(zone_id!="All" && zone_id!=undefined)
          {
            newobject.zones_id=zone_id;
          }
          if(circle_id!="All" && circle_id!=undefined)
          {
            newobject.circles_id=circle_id;
          }

          if(ward_id!="All"  && ward_id!=undefined)
          {
            newobject.ward_id=ward_id;
          }
            date = formatted_date; 
            console.log(newobject);
            let vehicles_list = await vehicles.find(newobject).exec();
            console.log(vehicles_list);
            const addDays = (date, days = 1) =>
            {
                const result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
              };
              
              const dateRange = (start, end, range = []) =>
              {
                if (start > end) return range;
                const next = addDays(start, 1);
                return dateRange(next, end, [...range, start]);
              };
            // let newDate = req.body.reportrange.split("-");
             const range = dateRange(new Date(from_date), new Date(to_date));
             let arrDate = range.map(date => date.toISOString().slice(0, 10));   
             dates_search = arrDate;
             console.log(dates_search);
            const res_data=await Promise.all(vehicles_list.map(async (vehicleslist) => 
            {
                let response_data={};
                response_data["zone"]=vehicleslist.zone;
                response_data["circle"]=vehicleslist.circle_no+vehicleslist.circle;
                response_data["wards"]=vehicleslist.wards_no+vehicleslist.ward_name;
                response_data["area"]=vehicleslist.location;
                response_data["landmark"]="";
                response_data["Vechile_type"]=vehicleslist.vehicle_type;
                response_data["vehicle_no"]=vehicleslist.vehicle_registration_number;
                response_data["driver_name"]=vehicleslist.driver_name;
                response_data["driver_mobile"]=vehicleslist.driver_number; 
                 if(dates_search.length>1)
                 {
                    const days_data=await Promise.all(dates_search.map(async (dates) => 
                    {
                        let dates_data={};
                        let dates_count = await transfer_staion.find({import_data_unique_no:vehicleslist.unique_no,date:dates}).countDocuments();
                        response_data[dates]=dates_count;
                    }));
                    console.log(response_data);  
                 }
                 else
                 {
                    let formatted_date=dates_search[0]; 
                 
                    let vehicles_count = await transfer_staion.find({import_data_unique_no:vehicleslist.unique_no,date:formatted_date}).countDocuments();
                     console.log(vehicles_count);
                    if(vehicles_count>0)
                    {
                        let vehicles_scan = await transfer_staion.find({import_data_unique_no:vehicleslist.unique_no,date:formatted_date}).exec();
                        let users_list = await User.findOne({_id:vehicles_scan[0].user_id}).exec();
                        response_data["transfer_station_name1"]=(users_list.username!="")?users_list.username:'-';
                        response_data["date_time1"]=(vehicles_scan[0].date!="")?vehicles_scan[0].date:"-";
                        response_data["weight1"]=(vehicles_scan[0].wastage_weight!="")?vehicles_scan[0].wastage_weight:'-';
                        response_data["image1"]="";
                        if(vehicles_count>1)
                        {
                            let users_list_one = await User.findOne({_id:vehicles_scan[1].user_id}).exec();
                            response_data["transfer_station_name2"]=(users_list_one.username!="")?users_list_one.username:'-';
                            response_data["date_time2"]=(vehicles_scan[1].date!="")?vehicles_scan[1].date:"-";
                            response_data["weight2"]=(vehicles_scan[1].wastage_weight!="")?vehicles_scan[1].wastage_weight:'-';
                            response_data["image2"]="";
                        }
                        else 
                        {
                            response_data["transfer_station_name2"]="-";
                            response_data["date_time2"]="-";
                            response_data["weight2"]="-";
                            response_data["image2"]="-";
                        }
    
                        if(vehicles_count>2)
                        {
                            let users_list_two = await User.findOne({_id:vehicles_scan[2].user_id}).exec();
                            response_data["transfer_station_name3"]=(users_list_two.username!="")?users_list_two.username:'-';
                            response_data["date_time3"]=(vehicles_scan[2].date!="")?vehicles_scan[2].date:"-";
                            response_data["weight3"]=(vehicles_scan[2].wastage_weight!="")?vehicles_scan[2].wastage_weight:'-';
                            response_data["image3"]="";
                        }
                        else 
                        {
                            response_data["transfer_station_name3"]="-";
                            response_data["date_time3"]="-";
                            response_data["weight3"]="-";
                            response_data["image3"]="-";
                        }
    
                        if(vehicles_count>3)
                        {
                            let users_list_two = await User.findOne({_id:vehicles_scan[2].user_id}).exec();
                            response_data["transfer_station_name4"]=(users_list_two.username!="")?users_list_two.username:'-';
                            response_data["date_time4"]=(vehicles_scan[2].date!="")?vehicles_scan[2].date:"-";
                            response_data["weight4"]=(vehicles_scan[2].wastage_weight!="")?vehicles_scan[2].wastage_weight:'-';
                            response_data["image4"]="";
                        }
                        else 
                        {
                            response_data["transfer_station_name4"]="-";
                            response_data["date_time4"]="-";
                            response_data["weight4"]="-";
                            response_data["image4"]="-";
                        }
    
                        if(vehicles_count>4)
                        {
                            let users_list_five = await User.findOne({_id:vehicles_scan[4].user_id}).exec();
                            response_data["transfer_station_name5"]=(users_list_five.username!="")?users_list_five.username:'-';
                            response_data["date_time5"]=(vehicles_scan[4].date!="")?vehicles_scan[4].date:"-";
                            response_data["weight5"]=(vehicles_scan[4].wastage_weight!="")?vehicles_scan[4].wastage_weight:'-';
                            response_data["image5"]="";
                        }
                        else 
                        {
                            response_data["transfer_station_name4"]="-";
                            response_data["date_time5"]="-";
                            response_data["weight5"]="-";
                            response_data["image5"]="-";
                        }
    
    
                        if(vehicles_count>5)
                        {
                            let users_list_six = await User.findOne({_id:vehicles_scan[5].user_id}).exec();
                            response_data["transfer_station_name6"]=(users_list_six.username!="")?users_list_six.username:'-';
                            response_data["date_time6"]=(vehicles_scan[5].date!="")?vehicles_scan[5].date:"-";
                            response_data["weight6"]=(vehicles_scan[5].wastage_weight!="")?vehicles_scan[5].wastage_weight:'-';
                            response_data["image6"]="";    
                        }
                        else 
                        {
                            response_data["transfer_station_name6"]="-";
                            response_data["date_time6"]="-";
                            response_data["weight6"]="-";
                            response_data["image6"]="-";
                        }
                    }
                    else
                    {
                        response_data["transfer_station_name1"]="-";
                        response_data["date_time1"]="-";
                        response_data["weight1"]="-";
                        response_data["image1"]="-";
    
                        response_data["transfer_station_name2"]="-";
                        response_data["date_time2"]="-";
                        response_data["weight2"]="-";
                        response_data["image2"]="-";
    
                        response_data["transfer_station_name3"]="-";
                        response_data["date_time3"]="-";
                        response_data["weight3"]="-";
                        response_data["image3"]="-";
    
                        response_data["transfer_station_name4"]="-";
                        response_data["date_time4"]="-";
                        response_data["weight4"]="-";
                        response_data["image4"]="-";
    
                        response_data["transfer_station_name5"]="-";
                        response_data["date_time5"]="-";
                        response_data["weight5"]="-";
                        response_data["image5"]="-";
    
                        response_data["transfer_station_name6"]="-";
                        response_data["date_time6"]="-";
                        response_data["weight6"]="-";
                        response_data["image6"]="-";
                    }
                 }
               
                return response_data;
            }));
            console.log(res_data);
            if(res_data.length>0)
            {
                var keys = Object.keys(res_data[0]);
            }
           else
           {
            var keys =["zone","circle","wards","area","landmark","Vechile_type","vehicle_no","driver_name",
            "driver_mobile","transfer_station_name1","date_time1","weight1","image1","trips_count1",
            "transfer_station_name2","date_time2","weight2","image2","trips_count2","transfer_station_name3",
            "date_time3","weight3","image3","trips_count3","transfer_station_name4","date_time4","weight4","image4",
            "trips_count4","date_time5","weight5","image5","trips_count5","transfer_station_name6","date_time6","weight6",
            "image6","trips_count6"];
           }
           return res.status(200).send({login:true,status:true,data:res_data,keys:keys});
} 







var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    { 
      cb(null, './uploads/transfer_station/original/'); 
    }, 
    filename: (req, file, cb) => 
    {
      cb(null,  Date.now() + '-' + file.originalname);
    }
});
exports.upload = multer({storage: storage});

  