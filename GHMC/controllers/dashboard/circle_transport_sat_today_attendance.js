const User = require('../../model/users');
const Department = require('../../model/department'); 
const Zones  = require('../../model/zones'); 
const Circles = require('../../model/circles'); 
const Vehicles = require('../../model/vehicles')
const Transfer_station = require('../../model/transferstation'); 

exports.circle_transport_sat_today_attendance = async(req,res)=>{

    let current_datetime = new Date(); 
    let s = new String(current_datetime.getDate()); 
    let cd; 	
    if(s.length == 1){
        cd = '0'+s; 
    }else{
        cd = current_datetime.getDate(); 
    } 
    let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;
    
    console.log(formatted_date)

    const { user_id } = req.body; 
    let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
    let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
    if(role_data.name == 'Admin'){

        let newobject = {}; 
        if(req.body.tenent_id != '' && req.body.tenent_id != undefined){
            newobject['tenent_id'] = req.body.tenent_id; 
        }

        const zones_details = await Zones.find(newobject,{name:1}).sort( { name: 1 } ).exec();
        //console.log(zones_details);
        async function transport_sat_report(data){
            let final_array = [];  
            await Promise.all(zones_details.map( async(val)=>{
                let obj ={}; 
                obj['zone_details'] = val.name;
                const circles_details = await Circles.find({zones_id:val._id},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
              //  console.log(circles_details); 
                obj['circle_details'] = []; 
                await Promise.all(circles_details.map( async(cir_val)=>{
                    let cir_obj = {circle_name: cir_val.name,circle_no:cir_val.circle_no};
                   
                    const cc_ghmc =   await Transfer_station.aggregate([
                        { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['GHMC Swatch Auto']}} },
                        {
                            $group: {_id: "$import_data_unique_no",count: { $sum: 1 }}
                        } 
                    ]); 
                  //  console.log(cc_ghmc)
                    cir_obj['tvghmcattend'] = cc_ghmc.length;   
                    if(cc_ghmc.length > 0){
                    var totalCount = cc_ghmc.reduce((accum,item) => accum + item.count, 0) 
                    }else{
                        var totalCount = 0; 
                    }
                    cir_obj['tsghmctrips'] = totalCount; 

                    const cc_private =   await Transfer_station.aggregate([
                        { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['Private Swatch Auto']}} },
                        {
                            $group: {_id: "$import_data_unique_no",count: { $sum: 1 }}
                        } 
                    ]);
                    cir_obj['tvprivateattend'] = cc_private.length;   
                    if(cc_private.length > 0){
                        var totalCount_pri = cc_private.reduce((accum,item) => accum + item.count, 0) 
                        }else{
                            var totalCount_pri = 0; 
                        }


                        cir_obj['tsprivatetrips'] = totalCount_pri; 
                        cir_obj['total_attend_scanned_vehicle'] =  cc_ghmc.length + cc_private.length; 
                    
                        const count_data_tss1 = await Transfer_station.aggregate([ 
                            { "$match": { vechile_type : {$in :['GHMC Swatch Auto']},circle_id:cir_val._id,date:formatted_date } }, 
                            {   
                                $lookup:{ 
                                    from: "vehicles",             
                                    localField: "import_data_unique_no",    
                                    foreignField: "unique_no",   
                                    as: "vehicles_info"        
                                } 
                            },
                            {   $unwind:"$vehicles_info" }, 
                        ]); 
                        //console.log(count_data.length); 
                        const count_data_tssp = await Transfer_station.aggregate([ 
                            { "$match": { vechile_type : {$in :['Private Swatch Auto']},circle_id:cir_val._id,date:formatted_date } }, 
                            {   
                                $lookup:{ 
                                    from: "vehicles",             
                                    localField: "import_data_unique_no",    
                                    foreignField: "unique_no",   
                                    as: "vehicles_info"        
                                } 
                            },
                            {   $unwind:"$vehicles_info" }, 
                        ]);

                        var tss1 = count_data_tss1.length;
                        var tssp = count_data_tssp.length; 

                        var tss = tss1+ tssp; 
                        var ttt = cc_ghmc.length + cc_private.length; 

                        var aaa = ttt - tss; 
                        var bbb = tss - ttt; 

                        if(aaa >= 0){
                            aaa = aaa;
                        }else{
                            aaa = 0;   
                        } 

                        if(bbb >= 0){
                            bbb = bbb;
                        }else{
                            bbb = 0;   
                        }  

                         cir_obj['total_absent'] =  aaa;
                         cir_obj['Non_attended_Scanned'] = bbb; 
                    obj['circle_details'].push(cir_obj);  

                }));
                final_array.push(obj); 
            }));
            return final_array; 
        }


        let satReport = transport_sat_report(1);

        satReport.then(function(result) {
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
            async function transport_sat_report(data){
                let final_array = [];  
                await Promise.all(zones_details.map( async(val)=>{
                    let obj ={}; 
                    obj['zone_details'] = val.name;
                    const circles_details = await Circles.find({zones_id:val._id,_id:{$in: acc_circles}},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
                  //  console.log(circles_details); 
                    obj['circle_details'] = []; 
                    await Promise.all(circles_details.map( async(cir_val)=>{
                        let cir_obj = {circle_name: cir_val.name,circle_no:cir_val.circle_no};
                       
                        const cc_ghmc =   await Transfer_station.aggregate([
                            { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['GHMC Swatch Auto']}} },
                            {
                                $group: {_id: "$import_data_unique_no",count: { $sum: 1 }}
                            } 
                        ]); 
                      //  console.log(cc_ghmc)
                        cir_obj['tvghmcattend'] = cc_ghmc.length;   
                        if(cc_ghmc.length > 0){
                        var totalCount = cc_ghmc.reduce((accum,item) => accum + item.count, 0) 
                        }else{
                            var totalCount = 0; 
                        }
                        cir_obj['tsghmctrips'] = totalCount; 
    
                        const cc_private =   await Transfer_station.aggregate([
                            { "$match": {date:formatted_date,circle_id:cir_val._id,vechile_type:{$in:['Private Swatch Auto']}} },
                            {
                                $group: {_id: "$import_data_unique_no",count: { $sum: 1 }}
                            } 
                        ]);
                        cir_obj['tvprivateattend'] = cc_private.length;      
                        if(cc_private.length > 0){
                            var totalCount_pri = cc_private.reduce((accum,item) => accum + item.count, 0) 
                            }else{
                                var totalCount_pri = 0; 
                            }
    
    
                            cir_obj['tsprivatetrips'] = totalCount_pri; 
                            cir_obj['total_attend_scanned_vehicle'] =  cc_ghmc.length + cc_private.length; 
                        
                            const count_data_tss1 = await Transfer_station.aggregate([ 
                                { "$match": { vechile_type : {$in :['GHMC Swatch Auto']},circle_id:cir_val._id,date:formatted_date } }, 
                                {   
                                    $lookup:{ 
                                        from: "vehicles",             
                                        localField: "import_data_unique_no",    
                                        foreignField: "unique_no",   
                                        as: "vehicles_info"        
                                    } 
                                },
                                {   $unwind:"$vehicles_info" }, 
                            ]); 
                            //console.log(count_data.length); 
                            const count_data_tssp = await Transfer_station.aggregate([ 
                                { "$match": { vechile_type : {$in :['Private Swatch Auto']},circle_id:cir_val._id,date:formatted_date } }, 
                                {   
                                    $lookup:{ 
                                        from: "vehicles",             
                                        localField: "import_data_unique_no",    
                                        foreignField: "unique_no",   
                                        as: "vehicles_info"        
                                    } 
                                },
                                {   $unwind:"$vehicles_info" }, 
                            ]);
    
                            var tss1 = count_data_tss1.length;
                            var tssp = count_data_tssp.length; 
    
                            var tss = tss1+ tssp; 
                            var ttt = cc_ghmc.length + cc_private.length; 
    
                            var aaa = ttt - tss; 
                            var bbb = tss - ttt; 
    
                            if(aaa >= 0){
                                aaa = aaa;
                            }else{
                                aaa = 0;   
                            } 
    
                            if(bbb >= 0){
                                bbb = bbb;
                            }else{
                                bbb = 0;   
                            }  
    
                             cir_obj['total_absent'] =  aaa;
                             cir_obj['Non_attended_Scanned'] = bbb;   
                        obj['circle_details'].push(cir_obj);    
    
                    }));
                    final_array.push(obj); 
                }));
                return final_array; 
            }
    
    
            let satReport = transport_sat_report(1);
    
            satReport.then(function(result) {
                res.status(200).send({login:true,success:false,data:result});   
            });
    }
}