const User     = require('../../model/users');
const Useraccess = require('../../model/useraccess'); 
const Department = require('../../model/department'); 
const Zones = require('../../model/zones');
const Circles = require('../../model/circles'); 
const Vehicle_attendance = require('../../model/vehicles_attandance'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

exports.transport_vehicle_attendance = async(req,res)=>{
    const { user_id } = req.body; 
  
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
 //   let formatted_date =   '2021-12-05';

    if(role_data.name == 'Admin'){

        let newobject = {}; 
        if(req.body.tenent_id != '' && req.body.tenent_id != undefined){
            newobject['tenent_id'] = req.body.tenent_id; 
        }
        
        const zones_details = await Zones.find(newobject,{name:1}).sort( { name: 1 } ).exec();
       
        async function transport_veh_report(data){
            let final_array = [];  
            await Promise.all(zones_details.map( async(val)=>{
                let obj ={}; 
                obj['zone_details'] = val.name;
                const circles_details = await Circles.find({zones_id:val._id},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                obj['circle_details'] = [];  
                await Promise.all(circles_details.map( async(cir_val)=>{
                    let cir_obj = {circle_no: cir_val.circle_no,circle_name: cir_val.name};
                    cir_obj['total_no_vehicles'] = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date}).countDocuments();
                    cir_obj['ghmc'] = [];
                    const total_ghmc_count = await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']},date:formatted_date}).countDocuments();
                    const total_ghmcpresent_count =  await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']},attandance:1,date:formatted_date }).countDocuments();
                    cir_obj['ghmc'].push({'total':total_ghmc_count,'present':total_ghmcpresent_count})

                    cir_obj['private'] = [];
                    const total_privateveh_count = await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$nin:['GHMC Swatch Auto']},date:formatted_date}).countDocuments();
                    const total_privatepresent_count =  await Vehicle_attendance.find({vehicle_type:{$nin:['GHMC Swatch Auto']},attandance:1,date:formatted_date}).countDocuments();
                    cir_obj['private'].push({'total':total_privateveh_count,'present':total_privatepresent_count})
                   
                   
                    const all_present_count = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date,attandance:1}).countDocuments();
                    cir_obj['present_counts']   = all_present_count;     
                    
                    const all_abscent_count = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date,attandance:0}).countDocuments(); 
                    cir_obj['abscent_counts']   = all_abscent_count;
                  
                    obj['circle_details'].push(cir_obj);  
                }));  
                final_array.push(obj); 
            }));
            return final_array; 
        }

        let userToken = transport_veh_report(1);

        userToken.then(function(result) {
            res.status(200).send({login:true,success:false,message:result});  
        });

    }else{
 
            const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
            console.log('not')
            let acc_zones = [];
            let acc_circles = []; 
            acc_zones = access_data['zones'].map((val)=>{
                return ObjectId(val)
            })
            acc_circles = access_data['circles'].map((val)=>{
                return ObjectId(val)
            })

            let newobject = {}; 
            newobject._id = {$in: acc_zones};
       //     newobject.circles_id = {$in: acc_circles};
            console.log(newobject)
            const zones_details = await Zones.find(newobject,{name:1}).sort( { name: 1 } ).exec();

           // console.log(zones_details); 
            async function transport_veh_report(data){
                let final_array = [];  
                await Promise.all(zones_details.map( async(val)=>{
                    let obj ={}; 
                    obj['zone_details'] = val.name;
                    const circles_details = await Circles.find({zones_id:val._id,_id:{$in: acc_circles}},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                    obj['circle_details'] = [];  
                    await Promise.all(circles_details.map( async(cir_val)=>{
                        let cir_obj = {circle_no: cir_val.circle_no,circle_name: cir_val.name};
                        cir_obj['total_no_vehicles'] = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date}).countDocuments();
                        cir_obj['ghmc'] = [];
                        const total_ghmc_count = await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']},date:formatted_date}).countDocuments();
                        const total_ghmcpresent_count =  await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']},attandance:1,date:formatted_date }).countDocuments();
                        cir_obj['ghmc'].push({'total':total_ghmc_count,'present':total_ghmcpresent_count})
    
                        cir_obj['private'] = [];
                        const total_privateveh_count = await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$nin:['GHMC Swatch Auto']},date:formatted_date}).countDocuments();
                        const total_privatepresent_count =  await Vehicle_attendance.find({vehicle_type:{$nin:['GHMC Swatch Auto']},attandance:1,date:formatted_date}).countDocuments();
                        cir_obj['private'].push({'total':total_privateveh_count,'present':total_privatepresent_count})
                       
                       
                        const all_present_count = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date,attandance:1}).countDocuments();
                        cir_obj['present_counts']   = all_present_count;     
                        
                        const all_abscent_count = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date,attandance:0}).countDocuments(); 
                        cir_obj['abscent_counts']   = all_abscent_count;
                      
                        obj['circle_details'].push(cir_obj);  
                    }));  
                    final_array.push(obj); 
                }));
                return final_array; 
            }

            let userToken = transport_veh_report(1);

            userToken.then(function(result) {
               res.status(200).send({login:true,success:false,data:result});  
            });

    }
}


exports.transport_vehicle_attendance_search = async(req,res)=>{
        const { date_search,user_id } = req.body; 
        let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 

    let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
 
    let formatted_date =   date_search;
 //   let formatted_date =   '2021-12-05'; 

    if(role_data.name == 'Admin'){

        let newobject = {}; 
        if(req.body.tenent_id != '' && req.body.tenent_id != undefined){
            newobject['tenent_id'] = req.body.tenent_id; 
        }
        
        const zones_details = await Zones.find(newobject,{name:1}).sort( { name: 1 } ).exec();
       
        async function transport_veh_report(data){
            let final_array = [];  
            await Promise.all(zones_details.map( async(val)=>{
                let obj ={}; 
                obj['zone_details'] = val.name;
                const circles_details = await Circles.find({zones_id:val._id},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                obj['circle_details'] = [];  
                await Promise.all(circles_details.map( async(cir_val)=>{
                    let cir_obj = {circle_no: cir_val.circle_no,circle_name: cir_val.name};
                    cir_obj['total_no_vehicles'] = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date}).countDocuments();
                    cir_obj['ghmc'] = [];
                    const total_ghmc_count = await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']},date:formatted_date}).countDocuments();
                    const total_ghmcpresent_count =  await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']},attandance:1,date:formatted_date }).countDocuments();
                    cir_obj['ghmc'].push({'total':total_ghmc_count,'present':total_ghmcpresent_count})

                    cir_obj['private'] = [];
                    const total_privateveh_count = await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$nin:['GHMC Swatch Auto']},date:formatted_date}).countDocuments();
                    const total_privatepresent_count =  await Vehicle_attendance.find({vehicle_type:{$nin:['GHMC Swatch Auto']},attandance:1,date:formatted_date}).countDocuments();
                    cir_obj['private'].push({'total':total_privateveh_count,'present':total_privatepresent_count})
                   
                   
                    const all_present_count = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date,attandance:1}).countDocuments();
                    cir_obj['present_counts']   = all_present_count;     
                    
                    const all_abscent_count = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date,attandance:0}).countDocuments(); 
                    cir_obj['abscent_counts']   = all_abscent_count;
                  
                    obj['circle_details'].push(cir_obj);  
                }));  
                final_array.push(obj); 
            }));
            return final_array; 
        }

        let userToken = transport_veh_report(1);

        userToken.then(function(result) {
            res.status(200).send({login:true,success:false,message:result});  
        });

    }else{
 
            const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
            console.log('not')
            let acc_zones = [];
            let acc_circles = []; 
            acc_zones = access_data['zones'].map((val)=>{
                return ObjectId(val)
            })
            acc_circles = access_data['circles'].map((val)=>{
                return ObjectId(val)
            })

            let newobject = {}; 
            newobject._id = {$in: acc_zones};
       //     newobject.circles_id = {$in: acc_circles};
            console.log(newobject)
            const zones_details = await Zones.find(newobject,{name:1}).sort( { name: 1 } ).exec();

           // console.log(zones_details); 
            async function transport_veh_report(data){
                let final_array = [];  
                await Promise.all(zones_details.map( async(val)=>{
                    let obj ={}; 
                    obj['zone_details'] = val.name;
                    const circles_details = await Circles.find({zones_id:val._id,_id:{$in: acc_circles}},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                    obj['circle_details'] = [];  
                    await Promise.all(circles_details.map( async(cir_val)=>{
                        let cir_obj = {circle_no: cir_val.circle_no,circle_name: cir_val.name};
                        cir_obj['total_no_vehicles'] = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date}).countDocuments();
                        cir_obj['ghmc'] = [];
                        const total_ghmc_count = await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']},date:formatted_date}).countDocuments();
                        const total_ghmcpresent_count =  await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']},attandance:1,date:formatted_date }).countDocuments();
                        cir_obj['ghmc'].push({'total':total_ghmc_count,'present':total_ghmcpresent_count})
    
                        cir_obj['private'] = [];
                        const total_privateveh_count = await Vehicle_attendance.find({circles_id:cir_val._id,vehicle_type:{$nin:['GHMC Swatch Auto']},date:formatted_date}).countDocuments();
                        const total_privatepresent_count =  await Vehicle_attendance.find({vehicle_type:{$nin:['GHMC Swatch Auto']},attandance:1,date:formatted_date}).countDocuments();
                        cir_obj['private'].push({'total':total_privateveh_count,'present':total_privatepresent_count})
                       
                       
                        const all_present_count = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date,attandance:1}).countDocuments();
                        cir_obj['present_counts']   = all_present_count;     
                        
                        const all_abscent_count = await Vehicle_attendance.find({circles_id:cir_val._id,date:formatted_date,attandance:0}).countDocuments(); 
                        cir_obj['abscent_counts']   = all_abscent_count;
                      
                        obj['circle_details'].push(cir_obj);  
                    }));  
                    final_array.push(obj); 
                }));
                return final_array; 
            }

            let userToken = transport_veh_report(1);

            userToken.then(function(result) {
               res.status(200).send({login:true,success:false,data:result});  
            });

    }
}