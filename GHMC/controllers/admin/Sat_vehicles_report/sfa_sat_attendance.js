const User = require('../../../model/users'); 
const Department = require('../../../model/department'); 
const Vehicles = require('../../../model/vehicles'); 
const Vehicles_attendance = require('../../../model/vehicles_attandance'); 
const Useraccess = require('../../../model/useraccess'); 
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


exports.sfa_sat_attendance = async(req,res)=>{
    
    const { user_id , tenent_id } = req.body; 

    let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
    let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});

    let current_datetime = new Date(); 
    let s = new String(current_datetime.getDate()); 
    let cd; 	
    if(s.length == 1){
        cd = '0'+s; 
    }else{
        cd = current_datetime.getDate(); 
    } 
    let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;


    if(role_data.name == 'Admin'){
            if(tenent_id == '' || tenent_id == undefined){
                return res.status(400).send({login:true,status:false,message:'Tenent id is required'}); 
            }

            const user_details = await User.aggregate([
                {
                    "$match" : {department_name:'SFA',tenent_id:ObjectId(tenent_id)}
                },
                {   
                    $lookup:{ 
                        from: "vehicles",             
                        localField: "_id",    
                        foreignField: "sfa_id",   
                        as: "details_info"        
                    } 
                },
                {   $unwind:"$details_info" }, 
                {"$match": {"details_info.vehicle_type":{$in:['GHMC Swatch Auto','Private Swatch Auto']}}},
               //  {$group : {_id : "$_id", num_tutorial : {$sum : 1}}}, 
                {
                    $project : {
                        _id: 1,
                        first_name:1,
                        zone_name : "$details_info.zone",
                        circle_name : "$details_info.circle",
                        unique_no: "$details_info.unique_no",
                        sfa_no : '$_id'
                    }
                },
                { "$sort" : { circle_name : -1 }}
            ])
            
            // console.log(user_details); 

             const det = [];
             user_details.forEach((val)=>{
                 let ob= {};
                 ob['id'] = val._id;
                 ob['first_name'] = val.first_name;
                 ob['zone_name'] = val.zone_name;
                 ob['circle_name'] = val.circle_name;
                 ob['unique_no'] = val.unique_no;
                 ob['sfa_no'] = String(val.sfa_no);
                 det.push(ob); 
             }); 
             
             console.log(det);
            
            var filterArray = det.reduce((accumalator, current) => {
                
                if(!accumalator.some(item => item.sfa_no === current.sfa_no)) {
                  accumalator.push(current);
                }
                return accumalator;
            },[]);

           // console.log(filterArray)
           
           let final_sfa_array = []; 
           await Promise.all(filterArray.map( async(details,index)=>{
           
                let sfa_obj ={zone_name:details.zone_name,circle_name:details.circle_name,first_name:details.first_name }; 
                // console.log(filterArray[i].sfa_no)
                const vehicle_count = await Vehicles_attendance.find({sfa_id:ObjectId(details.sfa_no),date:formatted_date}).countDocuments(); 
                sfa_obj['total_no_of_vehicles'] = vehicle_count;  
                const vehicle_count_attend = await Vehicles_attendance.find({sfa_id:ObjectId(details.sfa_no),date:formatted_date,attandance:1}).countDocuments(); 
                sfa_obj['total_no_of_vehicles_attend'] = vehicle_count_attend; 
                const vehicle_count_abb = await Vehicles_attendance.find({sfa_id:ObjectId(details.sfa_no),date:formatted_date,attandance:0}).countDocuments(); 
                sfa_obj['total_no_of_vehicles_abscent'] = vehicle_count_abb;
                sfa_obj['index'] = index; 
                final_sfa_array.push(sfa_obj); 
           }));

            final_sfa_array.sort((a, b) => { 
            return a.index - b.index;
            });

            final_sfa_array.forEach(object => {
            delete object['index'];
            });  
          // console.log(final_sfa_array); 
          return res.status(200).send({login:true,success:true,data:final_sfa_array }); 
   
    }else{
        const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
        let acc_zones = [];
        let acc_circles = [];

        acc_circles = access_data['circles'].map((val)=>{
            return ObjectId(val)
        })

        const user_details = await User.aggregate([
            {
                "$match" : {department_name:'SFA',_id:ObjectId(user_id)}
            },
            {   
                $lookup:{ 
                    from: "vehicles",             
                    localField: "_id",    
                    foreignField: "sfa_id",   
                    as: "details_info"        
                } 
            },
            {   $unwind:"$details_info" }, 
            {"$match": {"details_info.vehicle_type":{$in:['GHMC Swatch Auto','Private Swatch Auto']}}},
           //  {$group : {_id : "$_id", num_tutorial : {$sum : 1}}}, 
            {
                $project : {
                    _id: 1,
                    first_name:1,
                    zone_name : "$details_info.zone",
                    circle_name : "$details_info.circle",
                    unique_no: "$details_info.unique_no",
                    sfa_no : '$_id'
                }
            },
            { "$sort" : { circle_name : -1 }}
        ])
        
        // console.log(user_details); 

         const det = [];
         user_details.forEach((val)=>{
             let ob= {};
             ob['id'] = val._id;
             ob['first_name'] = val.first_name;
             ob['zone_name'] = val.zone_name;
             ob['circle_name'] = val.circle_name;
             ob['unique_no'] = val.unique_no;
             ob['sfa_no'] = String(val.sfa_no);
             det.push(ob); 
         }); 

        
        var filterArray = det.reduce((accumalator, current) => {
            
            if(!accumalator.some(item => item.sfa_no === current.sfa_no)) {
              accumalator.push(current);
            }
            return accumalator;
        },[]);

       // console.log(filterArray)
       
       let final_sfa_array = []; 
       for(var i=0; i < filterArray.length; i++)
       {
            let sfa_obj ={zone_name:filterArray[i].zone_name,circle_name:filterArray[i].circle_name,first_name:filterArray[i].first_name }; 
            // console.log(filterArray[i].sfa_no)
            const vehicle_count = await Vehicles_attendance.find({sfa_id:ObjectId(filterArray[i].sfa_no),date:formatted_date}).countDocuments(); 
            sfa_obj['total_no_of_vehicles'] = vehicle_count;  
            const vehicle_count_attend = await Vehicles_attendance.find({sfa_id:ObjectId(filterArray[i].sfa_no),date:formatted_date,attandance:1}).countDocuments(); 
            sfa_obj['total_no_of_vehicles_attend'] = vehicle_count_attend; 
            const vehicle_count_abb = await Vehicles_attendance.find({sfa_id:ObjectId(filterArray[i].sfa_no),date:formatted_date,attandance:0}).countDocuments(); 
            sfa_obj['total_no_of_vehicles_abscent'] = vehicle_count_abb;

            final_sfa_array.push(sfa_obj); 
       }
      // console.log(final_sfa_array); 
      return res.status(200).send({login:true,success:true,data:final_sfa_array });   
    }

}