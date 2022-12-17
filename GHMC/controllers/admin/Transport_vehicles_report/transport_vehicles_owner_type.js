const User = require('../../../model/users'); 
const Department = require('../../../model/department'); 
const Vehicles = require('../../../model/vehicles'); 
const Vehicles_attendance = require('../../../model/vehicles_attandance'); 
const Useraccess = require('../../../model/useraccess'); 
const Zones      = require('../../../model/zones'); 
const Circles    = require('../../../model/circles'); 
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


exports.transport_vehicles_owner_type = async(req,res)=>{ 
    
    const { user_id , tenent_id, date_search } = req.body; 

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

    let formatted_date; 
    if(date_search == ''){
        formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;
    }else{
        formatted_date = date_search; 
    }
    if(role_data.name == 'Admin'){
        if(tenent_id == '' || tenent_id == undefined){
            return res.status(400).send({login:true,status:false,message:'Tenent id is required'}); 
        }

        const zones_details = await Zones.find({tenent_id:tenent_id},{name:1}).sort( { name: 1 } ).sort({name:1}).exec();
        
       

        let final_attendance = []; 
      
        await Promise.all(zones_details.map( async(val)=>{
                let obj ={}; 
                obj['zone_details'] = val.name;
                const circles_details = await Circles.find({zones_id:val._id,tenent_id:tenent_id},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                //console.log(circles_details);
                obj['circle_details'] = []; 
                await Promise.all(circles_details.map( async(cir_val,index)=>{
                    let cir_obj = {circle_name: cir_val.name,circle_no: cir_val.circle_no };
                    //obj['circle_details'].push(cir_obj); 
                    let vehicle_cir_count = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']}}).countDocuments(); 
                    cir_obj['vehicle_count'] = vehicle_cir_count; 
                    cir_obj['ghmc'] = [];   
                    cir_obj['private'] = [];

                    let vehicle_cir_count_ghmc = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},owner_type:'GHMC' }).countDocuments(); 
                    let ghmc_details ={ghmc_total: vehicle_cir_count_ghmc}; 
                    let vehicle_cir_present_ghmc = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},owner_type:'GHMC',attandance:1 }).countDocuments();
                    ghmc_details['ghmc_present'] = vehicle_cir_present_ghmc; 
                    cir_obj['ghmc'].push(ghmc_details);

                    let vehicle_cir_count_private = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},owner_type:'Private' }).countDocuments(); 
                    let private_details ={ghmc_total: vehicle_cir_count_private}; 
                    let vehicle_cir_present_private = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},owner_type:'Private',attandance:1 }).countDocuments();
                    private_details['private_present'] = vehicle_cir_present_private; 
                    cir_obj['private'].push(private_details);

                    let total_veh_present = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},attandance:1}).countDocuments(); 
                    cir_obj['total_veh_present'] = total_veh_present; 
                    let total_veh_abs = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},attandance:0}).countDocuments(); 
                    cir_obj['total_veh_abs'] = total_veh_abs; 
                     
                    obj['circle_details'].push(cir_obj);    
                   // circle_d.push(cir_obj)

                })); 

                final_attendance.push(obj); 
        })); 
    
        return res.status(200).send({login:true,status:true,data:final_attendance})
    }else{
 
        const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
        let acc_zones = [];
        let acc_circles = [];

        acc_zones = access_data['zones'].map((val)=>{  
            return ObjectId(val)  
        })

        acc_circles = access_data['circles'].map((val)=>{
            return ObjectId(val)
        })



        const zones_details = await Zones.find({_id:{$in: acc_zones}},{name:1}).sort( { name: 1 } ).sort({name:1}).exec();
        //console.log(zones_details); 
        let final_attendance = []; 
      
        await Promise.all(zones_details.map( async(val)=>{
                let obj ={}; 
                obj['zone_details'] = val.name;
                const circles_details = await Circles.find({zones_id:val._id,_id:{$in:acc_circles}},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                //console.log(circles_details);
                obj['circle_details'] = []; 
                await Promise.all(circles_details.map( async(cir_val,index)=>{  
                    let cir_obj = {circle_name: cir_val.name,circle_no: cir_val.circle_no }; 
                    //obj['circle_details'].push(cir_obj);  
                    let vehicle_cir_count = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']}}).countDocuments(); 
                    cir_obj['vehicle_count'] = vehicle_cir_count; 
                    cir_obj['ghmc'] = [];   
                    cir_obj['private'] = []; 

                    let vehicle_cir_count_ghmc = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},owner_type:'GHMC' }).countDocuments(); 
                    let ghmc_details ={ghmc_total: vehicle_cir_count_ghmc}; 
                    let vehicle_cir_present_ghmc = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},owner_type:'GHMC',attandance:1 }).countDocuments();
                    ghmc_details['ghmc_present'] = vehicle_cir_present_ghmc; 
                    cir_obj['ghmc'].push(ghmc_details);

                    let vehicle_cir_count_private = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},owner_type:'Private' }).countDocuments(); 
                    let private_details ={ghmc_total: vehicle_cir_count_private}; 
                    let vehicle_cir_present_private = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},owner_type:'Private',attandance:1 }).countDocuments();
                    private_details['private_present'] = vehicle_cir_present_private; 
                    cir_obj['private'].push(private_details);

                    let total_veh_present = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},attandance:1}).countDocuments(); 
                    cir_obj['total_veh_present'] = total_veh_present; 
                    let total_veh_abs = await Vehicles_attendance.find({circles_id:ObjectId(cir_val._id),date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto','Private Swatch Auto']},attandance:0}).countDocuments(); 
                    cir_obj['total_veh_abs'] = total_veh_abs; 
                     
                    obj['circle_details'].push(cir_obj);    
                   // circle_d.push(cir_obj)

                })); 

                final_attendance.push(obj); 
        })); 
    
         

        return res.status(200).send({login:true,status:true,data:final_attendance})

    }

}