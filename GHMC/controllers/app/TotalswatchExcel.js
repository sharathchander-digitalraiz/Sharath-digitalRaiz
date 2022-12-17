const zones=require('../../model/zones');
const wards=require("../../model/wards");
const user =require("../../model/users");
const circles =require("../../model/circles");
const useraccess=require("../../model/useraccess");
const vehicles_attandance = require('../../model/vehicles_attandance'); 
const transfer_station = require('../../model/transferstation'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;
//const excel = require("exceljs");

const totalswatchExcel = async(req,res)=>{
    let user_id = req.query.user_id;  
    let date = req.query.date;
    let action = req.query.action;
    let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
    
    const dates_search =[date]; 
    let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
    //console.log(user_access_data.zones); 
    let allz = user_access_data.zones;
    let u_zones =[];
    u_zones = allz.map((val)=>{
         return ObjectId(val);
    })

      let newobject ={};
    newobject.zones_id = {$in :u_zones};
    
    newobject.vehicle_type = {$in :['GHMC Swatch Auto','Private Swatch Auto'] };

    newobject.date = date;
    if(action == 'attend'){
        newobject.attandance =  1;
    }
    
    if(action == 'not_attend'){ 
        newobject.attandance =  0; 
    }
    
  

    const alldata = await vehicles_attandance.aggregate([ 
        { "$match": newobject }, 
        {   
            $lookup:{ 
                from: "zones",             
                localField: "zones_id",    
                foreignField: "_id",   
                as: "zones_info"        
            } 
        },
        {   $unwind:"$zones_info" }, 
        {   
            $lookup:{
                from: "circles",      
                localField: "circles_id",    
                foreignField: "_id",   
                as: "circle_info"         
            }   
        },
        {   $unwind:"$circle_info" },  
        {   
            $lookup:{
                from: "wards",     
                localField: "ward_id",   
                foreignField: "_id", 
                as: "wards_info"        
            } 
        },
        {   $unwind:"$wards_info" },  
        // {   
        //     $lookup:{
        //         from: "areas",     
        //         localField: "areas_id",   
        //         foreignField: "_id", 
        //         as: "areas_info"        
        //     } 
        // },
        // {   $unwind:"$areas_info" }, 
        // {   
        //     $lookup:{
        //         from: "landmarks",     
        //         localField: "landmark_id",   
        //         foreignField: "_id", 
        //         as: "landmark_info"        
        //     } 
        // },
        // {   $unwind:"$landmark_info" },   
        {   
            $lookup:{
                from: "vehicles",       
                localField: "vehicle_unique_no",   
                foreignField: "unique_no", 
                as: "vehicle_info"         
            } 
        },
        {   $unwind:"$vehicle_info" }, 

        {   
            $project:{ 
 
                _id : 1,  
                zone_name : "$zones_info.name", 
                circle_name : "$circle_info.name", 
                wardname : { $concat: [ "$wards_info.wards_no", " - ", "$wards_info.name" ] },  
                area_name : "$areas_info.name",
                landmark_name: { $concat: [ "$landmark_info.landmark_from", " - ", "$landmark_to.name" ] },   
                vehicle_type:1,
                scanned_address:1,
                log_date_created:1,
                date:1,
                latitude:1,
                longitude:1,
                scan_image:1,
                attandance:1,
                sfa_name:1,  
                unique_nos:"$vehicle_info.unique_no",
                incharge_mobile_number:1,      
                vehicle_registration_number:1,
                owner_type:1, 
                driver_name : "$vehicle_info.driver_name",
                driver_mobile : "$vehicle_info.driver_number",
                landmark:"$vehicle_info.location",
                Transfer_station:"$vehicle_info.transfer_station",
            },
            
        }
    ]);
   
        if(action =='total' || action == 'attend' || action == 'not_attend')
        {
                let finaldata = [];
                alldata.forEach((obj) => {

                    finaldata.push({
                    zone: obj.zone_name,
                    circle: obj.circle_name,
                    ward: obj.wardname,
                    landMark: obj.landmark,
                    owner_type: obj.owner_type,
                    vehicle_type: obj.vehicle_type,
                    vehicle_registration_number: obj.vehicle_registration_number,
                    driver_name: obj.driver_name,
                    driver_mobile:obj.driver_mobile,
                    sfa_name:obj.sfa_name,
                    incharge_mobile_number: obj.incharge_mobile_number,
                    Transfer_station: obj.Transfer_station,
                    attendance : obj.attandance,
                    date_time: obj.log_date_created
                });
                });
            
                let workbook = new excel.Workbook();
                let worksheet = workbook.addWorksheet("Vehicle_Attendance");
            
                worksheet.columns = [
                { header: "Zone", key: "zone", width: 15 },
                { header: "Circle", key: "circle", width: 15 },
                { header: "Ward", key: "ward", width: 15 },
                { header: "LandMark", key: "landMark", width: 15 },
                { header: "Owner Type", key: "owner_type", width: 15 },
                { header: "Vehicle Type", key: "vehicle_type", width: 15 },
                { header: "Vehicle Reg Number", key: "vehicle_registration_number", width: 15 },
                { header: "Driver Name", key: "driver_name", width: 15 },
                { header: "Driver Mobile Number", key: "driver_mobile", width: 15 },
                { header: "Incharge Name", key: "sfa_name", width: 15 },
                { header: "Incharge Mobile Number", key: "incharge_mobile_number", width: 15 },
                { header: "Transfer Station", key: "Transfer_station", width: 15 },
                { header: "Attendence Status", key: "attendance", width: 15 },
                { header: "Date and time", key: "date_time", width: 15 },
                ];
            
                // Add Array Rows
                worksheet.addRows(finaldata);
            
                res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "Vehicle_attendance.xlsx"
                );
            
                return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
                });
            }
            else if(action =='total_trips')
            {
          
                 async function processtrips(data){
                     console.log(alldata); 
                    var finaldata = []; 
                    var i; 
                   for(i=0; i<alldata.length; i++){
                
                          let gd = {...alldata[i]}; 
                          gd ={zone_name:gd.zone_name,circle_name:gd.circle_name,wardname:gd.wardname,landmark:gd.landmark,owner_type:gd.owner_type,
                            vehicle_type:gd.vehicle_type,vehicle_registration_number:gd.vehicle_registration_number,driver_name:gd.driver_name
                        ,driver_number:gd.driver_mobile,transfer_attached:gd.Transfer_station,uni:gd.unique_nos,sfa:gd.sfa_name,
                        incharge_mobile_number:gd.incharge_mobile_number }; 
                           
                    
                   
                  
                       let t_count = await transfer_station.find({vechile_type:date,import_data_unique_no:alldata[i].unique_nos}).countDocuments();
                       
                    
                        if(t_count >= 1){
                         
                            let t_count_data = await transfer_station.find({vechile_type:date,import_data_unique_no:alldata[i].unique_nos}).exec();
                            gd['count']=t_count;
                            gd['created_date'] = t_count_data[t_count_data.length-1].log_date_created;
                        }
                         if(t_count == 0){
                            gd['count']=0;
                            gd['created_date'] = '';
                         
                        }
               
                   
                    finaldata.push(gd);  
                   }
            
                    return finaldata; 
                  
                  
               }

               let userToken = processtrips(1);
                userToken.then(async function(result) {
                //    return res.status(200).send({result}); 
             let workbook = new excel.Workbook();
             let worksheet = workbook.addWorksheet("Vehicle_trips");
         
             worksheet.columns = [
             { header: "Zone", key: "zone_name", width: 15 },
             { header: "Circle", key: "circle_name", width: 15 },
             { header: "Ward", key: "wardname", width: 15 },
             { header: "LandMark", key: "landmark", width: 15 },
             { header: "Owner Type", key: "owner_type", width: 15 },
             { header: "Vehicle Type", key: "vehicle_type", width: 15 },
             { header: "Vehicle Reg Number", key: "vehicle_registration_number", width: 15 },
             { header: "Driver Name", key: "driver_name", width: 15 },
             { header: "Driver Mobile Number", key: "driver_number", width: 15 },
             { header: "Incharge Name", key: "sfa", width: 15 },
             { header: "Incharge Mobile Number", key: "incharge_mobile_number", width: 15 },
             { header: "Transfer Station", key: "transfer_attached", width: 15 },
             { header: "trips", key: "count", width: 15 },
             { header: "Date and time", key: "created_date", width: 15 },
             ];
         
             // Add Array Rows
             worksheet.addRows(result);
         
             res.setHeader(
             "Content-Type",
             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
             );
             res.setHeader( 
             "Content-Disposition",
             "attachment; filename=" + "Vehicle_trips.xlsx"
             );
         
             return workbook.xlsx.write(res).then(function () {
             res.status(200).end();
             });
                
                }) 
            }



}

module.exports = {
    totalswatchExcel,
  };