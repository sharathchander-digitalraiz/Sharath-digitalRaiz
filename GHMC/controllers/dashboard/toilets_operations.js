const User     = require('../../model/users');
const Useraccess = require('../../model/useraccess'); 
const Department = require('../../model/department'); 
const Toilets = require('../../model/toilets'); 
const Toilets_operations = require('../../model/toilets_operations'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;


exports.toilets_operations_report = async(req,res)=>{
    const { user_id } = req.body; 
    console.log(req.body);
    let acc_dep_data = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
    // console.log(acc_dep_data); 
    let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
    console.log(role_data); 
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

        let newobject = {}; 
        if(req.body.tenent_id != '' && req.body.tenent_id != undefined){
            newobject['tenent_id'] = ObjectId(req.body.tenent_id); 
        }  
        operation_details = await Toilets.find(newobject,{place:0}).exec();

        async function process_operation_report(data){
            let finaldata = [];  
            await Promise.all(operation_details.map( async(val)=>{
                let new_obj ={zone_name: val.zone,circle_name: val.circle, ward_name:val.ward_name, area_name:val.area,
                    landmark_name :val.landmark,toilet_name:val.toilet_name,incharge_name:val.incharge_name,
                    incharge_mobile:val.incharge_mobile,image:val.image }; 
                const count_operation =  await Toilets_operations.find({collection_id:val._id,date:formatted_date}).countDocuments();
                if(count_operation == 1){
                new_obj[formatted_date] = 'Yes'
                }else{
                    new_obj[formatted_date] = 'No'
                }
                finaldata.push(new_obj);

            }))
            return finaldata;  
        }
        let userToken = process_operation_report(1);

        userToken.then(function(result) {
            res.status(200).send({login:true,success:false,message:result});  
        }); 
    }else{

        const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
            
        let acc_zones = [];
        let acc_circles = []; 
        let acc_wards = []; 
        let acc_areas = []; 
        let acc_landmark = []; 
        acc_zones = access_data['zones'].map((val)=>{
            return ObjectId(val)
        })
        acc_circles = access_data['circles'].map((val)=>{
            return ObjectId(val)
        })
        acc_wards = access_data['ward'].map((val)=>{
            return ObjectId(val)
        })
        acc_areas = access_data['areas'].map((val)=>{
            return ObjectId(val)
        })
        acc_landmark = access_data['landmarks'].map((val)=>{
            return ObjectId(val)
        })
        let newobject = {}; 
        newobject.zones_id = {$in: acc_zones};
        newobject.circles_id = {$in: acc_circles};
        newobject.ward_id = {$in: acc_wards};
        newobject.area_id = {$in: acc_areas};
        newobject.landmark_id = {$in: acc_landmark}; 
        console.log(newobject); 
        let operation_details = await Toilets.find(newobject,{place:0}).exec();

        async function process_operation_report(data){
            let finaldata = [];  
            await Promise.all(operation_details.map( async(val)=>{
                let new_obj ={id:val._id,zone_name: val.zone,circle_name: val.circle, ward_name:val.ward_name, area_name:val.area,
                    landmark_name :val.landmark,toilet_name:val.toilet_name,incharge_name:val.incharge_name,
                    incharge_mobile:val.incharge_mobile,image:val.image }; 
                const count_operation =  await Toilets_operations.find({collection_id:val._id,date:formatted_date}).countDocuments();
                if(count_operation == 1){
                new_obj[formatted_date] = 'Yes'
                const operation_details =  await Toilets_operations.find({collection_id:val._id,date:formatted_date}).exec();
                new_obj['weight'] = operation_details[0].approx_weight; 
                new_obj['op_img'] = operation_details[0].image; 
                }else{
                    new_obj[formatted_date] = 'No'
                    new_obj['weight'] = ''
                    new_obj['op_img'] = ''
                }
                finaldata.push(new_obj);

            }))
            return finaldata;  
        }
        let userToken = process_operation_report(1);

        userToken.then(function(result) {
            res.status(200).send({login:true,success:false,data:result});  
        }); 


    }
}



exports.toilets_operations_report_search = async(req,res)=>{
    const { user_id,zones_id,circles_id,ward_id,area_id,landmark_id } = req.body; 
    if(zones_id == '' || zones_id == undefined){
        return res.status(400).send({login:true,success:false,message:'Please select zone'})
    }
    let newobject ={};   
    if(zones_id != '' && zones_id != undefined){
        newobject['zones_id'] = ObjectId(zones_id); 
    }
    if(circles_id != '' && circles_id != undefined){
        newobject['circles_id'] = ObjectId(circles_id); 
    }      
    if(ward_id != '' && ward_id != undefined){
        newobject['ward_id'] = ObjectId(ward_id); 
    }
    if(area_id != '' && area_id != undefined){
        newobject['area_id'] = ObjectId(area_id); 
    } 
    if(landmark_id != '' && landmark_id != undefined){
        newobject['landmark_id'] = ObjectId(landmark_id); 
    }
    const addDays = (date, days = 1) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };
      
      const dateRange = (start, end, range = []) => {
        if (start > end) return range;
        const next = addDays(start, 1);
        return dateRange(next, end, [...range, start]);
      };
    
        // let newDate = req.body.reportrange.split("-");
        const range = dateRange(new Date('2021-12-03'), new Date('2021-12-04')); 
        let arrDate = range.map(date => date.toISOString().slice(0, 10));   
        dates_search = arrDate;  
       

        
    let operation_details = await Toilets.find(newobject,{place:0}).exec();
    async function process_operation_report(data){ 
            let finaldata = [];  
           
            await Promise.all(operation_details.map( async(val)=>{
                console.log(val); 
                let new_obj ={id:val._id,zone_name: val.zone,circle_name: val.circle, ward_name:val.ward_name, area_name:val.area,
                    landmark_name :val.landmark,toilet_name:val.toilet_name,incharge_name:val.incharge_name,
                    incharge_mobile:val.incharge_mobile,image:val.image }; 
                    new_obj['operation_details'] = []; 
                   
                await Promise.all(dates_search.map(async(dates)=>{
                    let arr_obj = {}; 
                    const count_operation =  await Toilets_operations.find({collection_id:val._id,date:dates}).countDocuments();
                    console.log(count_operation);
                    if(count_operation == 1){
                        arr_obj[dates] = 'Yes'
                        const operation_details =  await Toilets_operations.find({collection_id:val._id,date:dates}).exec();
                        arr_obj['weight'] = operation_details[0].approx_weight; 
                        arr_obj['op_img'] = operation_details[0].image; 
                        new_obj['operation_details'].push(arr_obj); 
                        }else{
                            arr_obj[dates] = 'No';
                            arr_obj['weight'] = ''; 
                            arr_obj['op_img'] = ''; 
                            new_obj['operation_details'].push(arr_obj); 
                        }
                       
                })); 
                finaldata.push(new_obj);   

            }))
            return finaldata;  
        }
        let userToken = process_operation_report(1);

        userToken.then(function(result) {
            res.status(200).send({login:true,success:false,message:result});  
        }); 
}

