const User     = require('../../model/users');
const Useraccess = require('../../model/useraccess'); 
const Department = require('../../model/department'); 
const Zones = require('../../model/zones');
const Circles = require('../../model/circles'); 
const Vehicles = require('../../model/vehicles'); 
const Vehicle_attendance = require('../../model/vehicles_attandance'); 
const Transfer_station   = require('../../model/transferstation'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;


exports.circle_transfer_station_attendance = async(req,res)=>{  

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
        console.log(zones_details); 
        async function transport_veh_report(data){
            let final_array = [];  
            await Promise.all(zones_details.map( async(val)=>{
                let obj ={}; 
                obj['zone_details'] = val.name;
                const circles_details = await Circles.find({zones_id:val._id},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                obj['circle_details'] = [];  
                await Promise.all(circles_details.map( async(cir_val)=>{
                    let cir_obj = {circle_name: cir_val.name};
                    cir_obj['ghmc'] = []; 
                    cir_obj['private'] = []; 
                    const vehicle_count_ghmc = await Vehicles.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']}}).countDocuments();
                    const cc_ghmc =   await Transfer_station.aggregate([
                        { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['GHMC Swatch Auto']}} },
                        {
                            $group: {_id: "$import_data_unique_no",count: { $sum: 1 },"Totalweight": {$sum: "$wastage_weight"}}
                        } 
                    ]); 
                  
                    if(cc_ghmc.length > 0){
                        var totalCount = cc_ghmc.reduce((accum,item) => accum + item.count, 0) 
                        var ghmc_wt  =  cc_ghmc.reduce((accum,item) => accum + item.Totalweight, 0) 
                        }else{
                            var totalCount = 0; 
                            var ghmc_wt = 0; 
                    }



                    cir_obj['ghmc'].push({'ghmc_total_vehicles':vehicle_count_ghmc,'ghmc_attend_vehicle':cc_ghmc.length,'ghmc_absent_vehicle':vehicle_count_ghmc-cc_ghmc.length,
                    'ghmc_trips': totalCount,'ghmc_weight':  ghmc_wt}); 


                    const vehicle_count_private = await Vehicles.find({circles_id:cir_val._id,vehicle_type:{$in:['Private Swatch Auto']}}).countDocuments();
                    const cc_private =   await Transfer_station.aggregate([
                        { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['Private Swatch Auto']}} },
                        {
                            $group: {_id: "$import_data_unique_no",count: { $sum: 1 },"Totalweight": {$sum: "$wastage_weight"}}
                        } 
                    ]);

                    if(cc_private.length > 0){
                        var totalCount_pri = cc_private.reduce((accum,item) => accum + item.count, 0) 
                        var totalCount_pri_wt = cc_private.reduce((accum,item) => accum + item.Totalweight, 0) 
                        }else{
                            var totalCount_pri_wt = 0; 
                        }


                    cir_obj['private'].push({'private_total_vehicles':vehicle_count_private,'private_attend_vehicle':cc_private.length,'ghmc_absent_vehicle':vehicle_count_private-cc_private.length,
                    'private_trips':totalCount_pri,'ghmc_weight':  totalCount_pri_wt}); 


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
    }else{
           const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
           // console.log('not')
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
           // console.log(newobject)
            const zones_details = await Zones.find(newobject,{name:1}).sort( { name: 1 } ).exec();
            async function transport_veh_report(data){
                let final_array = [];  
                await Promise.all(zones_details.map( async(val)=>{
                    let obj ={}; 
                    obj['zone_details'] = val.name;
                    const circles_details = await Circles.find({zones_id:val._id,_id:{$in: acc_circles}},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                    obj['circle_details'] = [];  
                    await Promise.all(circles_details.map( async(cir_val)=>{
                        let cir_obj = {circle_name: cir_val.name};
                        cir_obj['ghmc'] = []; 
                        cir_obj['private'] = []; 
                        const vehicle_count_ghmc = await Vehicles.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']}}).countDocuments();
                        const cc_ghmc =   await Transfer_station.aggregate([
                            { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['GHMC Swatch Auto']}} },
                            {
                                $group: {_id: "$import_data_unique_no",count: { $sum: 1 },"Totalweight": {$sum: "$wastage_weight"}}
                            } 
                        ]); 
                      
                        cir_obj['ghmc'].push({'ghmc_total_vehicles':vehicle_count_ghmc,'ghmc_attend_vehicle':cc_ghmc.length,'ghmc_absent_vehicle':vehicle_count_ghmc-cc_ghmc.length,
                        'ghmc_trips': (cc_ghmc.length > 0) ? cc_ghmc[0].count : 0,'ghmc_weight':  (cc_ghmc.length > 0) ? cc_ghmc[0].Totalweight : 0}); 
    
    
                        const vehicle_count_private = await Vehicles.find({circles_id:cir_val._id,vehicle_type:{$in:['Private Swatch Auto']}}).countDocuments();
                        const cc_private =   await Transfer_station.aggregate([
                            { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['Private Swatch Auto']}} },
                            {
                                $group: {_id: "$import_data_unique_no",count: { $sum: 1 },"Totalweight": {$sum: "$wastage_weight"}}
                            } 
                        ]);
                        cir_obj['private'].push({'private_total_vehicles':vehicle_count_private,'private_attend_vehicle':cc_private.length,'ghmc_absent_vehicle':vehicle_count_private-cc_private.length,
                        'private_trips': (cc_private.length > 0) ? cc_private[0].count : 0,'ghmc_weight':  (cc_private.length > 0) ? cc_private[0].Totalweight : 0}); 
    
    
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



exports.circle_transfer_station_search = async(req,res)=>{
    const { user_id,date_search } = req.body; 
  
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
       // console.log(zones_details); 
        async function transport_veh_report(data){
            let final_array = [];  
            await Promise.all(zones_details.map( async(val)=>{
                let obj ={}; 
                obj['zone_details'] = val.name;
                const circles_details = await Circles.find({zones_id:val._id},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                obj['circle_details'] = [];  
                await Promise.all(circles_details.map( async(cir_val)=>{
                    let cir_obj = {circle_name: cir_val.name};
                    cir_obj['ghmc'] = []; 
                    cir_obj['private'] = []; 
                    const vehicle_count_ghmc = await Vehicles.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']}}).countDocuments();
                    const cc_ghmc =   await Transfer_station.aggregate([
                        { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['GHMC Swatch Auto']}} },
                        {
                            $group: {_id: "$import_data_unique_no",count: { $sum: 1 },"Totalweight": {$sum: "$wastage_weight"}}
                        } 
                    ]); 
                  
                    cir_obj['ghmc'].push({'ghmc_total_vehicles':vehicle_count_ghmc,'ghmc_attend_vehicle':cc_ghmc.length,'ghmc_absent_vehicle':vehicle_count_ghmc-cc_ghmc.length,
                    'ghmc_trips': (cc_ghmc.length > 0) ? cc_ghmc[0].count : 0,'ghmc_weight':  (cc_ghmc.length > 0) ? cc_ghmc[0].Totalweight : 0}); 


                    const vehicle_count_private = await Vehicles.find({circles_id:cir_val._id,vehicle_type:{$in:['Private Swatch Auto']}}).countDocuments();
                    const cc_private =   await Transfer_station.aggregate([
                        { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['Private Swatch Auto']}} },
                        {
                            $group: {_id: "$import_data_unique_no",count: { $sum: 1 },"Totalweight": {$sum: "$wastage_weight"}}
                        } 
                    ]);
                    cir_obj['private'].push({'private_total_vehicles':vehicle_count_private,'private_attend_vehicle':cc_private.length,'ghmc_absent_vehicle':vehicle_count_private-cc_private.length,
                    'private_trips': (cc_private.length > 0) ? cc_private[0].count : 0,'ghmc_weight':  (cc_private.length > 0) ? cc_private[0].Totalweight : 0}); 


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
    }else{
        const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
          //  console.log('not')
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
          //  console.log(newobject)
            const zones_details = await Zones.find(newobject,{name:1}).sort( { name: 1 } ).exec();
            async function transport_veh_report(data){
                let final_array = [];  
                await Promise.all(zones_details.map( async(val)=>{
                    let obj ={}; 
                    obj['zone_details'] = val.name;
                    const circles_details = await Circles.find({zones_id:val._id,_id:{$in: acc_circles}},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                    obj['circle_details'] = [];  
                    await Promise.all(circles_details.map( async(cir_val)=>{
                        let cir_obj = {circle_name: cir_val.name};
                        cir_obj['ghmc'] = []; 
                        cir_obj['private'] = []; 
                        const vehicle_count_ghmc = await Vehicles.find({circles_id:cir_val._id,vehicle_type:{$in:['GHMC Swatch Auto']}}).countDocuments();
                        const cc_ghmc =   await Transfer_station.aggregate([
                            { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['GHMC Swatch Auto']}} },
                            {
                                $group: {_id: "$import_data_unique_no",count: { $sum: 1 },"Totalweight": {$sum: "$wastage_weight"}}
                            } 
                        ]); 
                      
                        cir_obj['ghmc'].push({'ghmc_total_vehicles':vehicle_count_ghmc,'ghmc_attend_vehicle':cc_ghmc.length,'ghmc_absent_vehicle':vehicle_count_ghmc-cc_ghmc.length,
                        'ghmc_trips': (cc_ghmc.length > 0) ? cc_ghmc[0].count : 0,'ghmc_weight':  (cc_ghmc.length > 0) ? cc_ghmc[0].Totalweight : 0}); 
    
    
                        const vehicle_count_private = await Vehicles.find({circles_id:cir_val._id,vehicle_type:{$in:['Private Swatch Auto']}}).countDocuments();
                        const cc_private =   await Transfer_station.aggregate([
                            { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['Private Swatch Auto']}} },
                            {
                                $group: {_id: "$import_data_unique_no",count: { $sum: 1 },"Totalweight": {$sum: "$wastage_weight"}}
                            } 
                        ]);
                        cir_obj['private'].push({'private_total_vehicles':vehicle_count_private,'private_attend_vehicle':cc_private.length,'ghmc_absent_vehicle':vehicle_count_private-cc_private.length,
                        'private_trips': (cc_private.length > 0) ? cc_private[0].count : 0,'ghmc_weight':  (cc_private.length > 0) ? cc_private[0].Totalweight : 0}); 
    
    
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