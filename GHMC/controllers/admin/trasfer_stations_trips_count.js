const vehicle = require('../../model/vehicles'); 
const transfer_station = require('../../model/transferstation'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;


exports.gettransfer_station_trips_count = async (req, res) => {  
    const {page} = req.body;

    let pc = page*10;
    var pc1 = pc-10; 
    let newobject ={};
    let current_datetime = new Date();
let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate()
     
    const totalC = await vehicle.find({}).countDocuments(); 
    //console.log(formatted_date)
    newobject.date = formatted_date; 
    const alldata = await vehicle.aggregate([
     //   { "$match": newobject }, 
        {   
            $lookup:{ 
                from: "zones",             // other table name              // 
                localField: "zones_id",   // name of users table field     //
                foreignField: "_id",     // name of userinfo table field  // 
                as: "zones_info"        // alias for userinfo table      //
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$zones_info" }, 
        {   
            $lookup:{
                from: "circles",       // other table name  
                localField: "circles_id",   // name of users table field 
                foreignField: "_id", // name of userinfo table field    
                as: "circle_info"         // alias for userinfo table
            }  
        },// define which fields are you want to fetch    
        {   $unwind:"$circle_info" },  
        {   
            $lookup:{
                from: "wards",       // other table name
                localField: "ward_id",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "wards_info"         // alias for userinfo table
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$wards_info" },  
        {   
            $lookup:{
                from: "landmarks",       // other table name
                localField: "landmark_id",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "landmarks_info"         // alias for userinfo table
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$landmarks_info" },  
        
        {   
            $project:{ 

                _id : 1,  
               
                zone_name : "$zones_info.name", 
                circle_name : "$circle_info.name", 
                wardname : { $concat: [ "$wards_info.wards_no", " - ", "$wards_info.name" ] },  
                landmark : { $concat: [ "$landmarks_info.landmark_from", " - ", "$landmarks_info.landmark_to" ] },
                owner_type:1,
                vehicle_type:1,
                vehicle_registration_number:1,
                unique_no:1,
                driver_name:1,
                driver_number:1,
                transfer_station:1,
            }
            
        },{ $skip: pc1 }, { $limit: 10 }
    ]);
    
   
       async function processtrips(data){
            var finaldata = []; 
            var i; 
           for(i=0; i<alldata.length; i++){
             //  console.log(alldata[i].unique_no); 
                const t_count = await transfer_station.find({vechile_type:formatted_date,import_data_unique_no:alldata[i].unique_no}).countDocuments();
                const t_count_data = await transfer_station.find({vechile_type:formatted_date,import_data_unique_no:alldata[i].unique_no}).exec();
                if(t_count == 0){
                 //   console.log('bye'); 
                    let oj ={date_time:'-',  weight:'', image:''}
                    finaldata.push({...alldata[i],...oj})
                }else if(t_count >= 1){
                  //  console.log('hi'); 
                    const cc =   await transfer_station.aggregate([
                        { "$match": {vechile_type:formatted_date,import_data_unique_no:alldata[i].unique_no} },
                        {
                            $group: {_id: null,"TotalAmount": {$sum: "$wastage_weight"}}
                        } 
                    ]); 

                    let oj ={date_time:t_count_data[0].log_date_created,  weight:cc[0].TotalAmount, image:t_count_data[0].image}
                    finaldata.push({...alldata[i],...oj})
                   
                }
               

           }
      
                return finaldata; 
          
          
       }

       let userToken = processtrips(1);
  //  console.log(alldata); 
        userToken.then(function(result) {
          //  console.log(result) // "Some User token"
            res.status(200).send({success:true,result,count:{totalC,page}})
        })
      
} 




exports.gettransfer_station_trips_count_search = async (req, res) => {

    const {page} = req.body;

    let pc = page*10;
    var pc1 = pc-10; 
    const totalC = await vehicle.find({}).countDocuments(); 
let newobject ={};
var dates_search; 
if(req.body.reportrange != ''){ 
  console.log('dates'); 
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
    let newDate = req.body.reportrange.split("-");
    const range = dateRange(new Date(newDate[0]), new Date(newDate[1]));
    let arrDate = range.map(date => date.toISOString().slice(0, 10));   
    dates_search = arrDate; 
    
}   
  
if(req.body.zones_id != '' && req.body.zones_id != undefined){
    
    newobject.zones_id = ObjectId(req.body.zones_id); 
} 
if(req.body.circles_id != ''  && req.body.zones_id != undefined){
    newobject.circles_id = ObjectId(req.body.circles_id);
} 

// if(req.body.vehicle_type == 'All' && req.body.vehicle_type ==''){
//     newobject.vehicle_type = {$in :['GHMC Swatch Auto','Private Swatch Auto'] };
// }  
if(req.body.vehicle_type == '1'){
    newobject.vehicle_type = {$in :['GHMC Swatch Auto','Private Swatch Auto'] };
}
if(req.body.vehicle_type == '2'){
    newobject.vehicle_type = {$nin :['GHMC Swatch Auto','Private Swatch Auto'] };
}

  
  //  console.log(newobject);
    const alldata = await vehicle.aggregate([
        { "$match": newobject }, 
        {   
            $lookup:{ 
                from: "zones",             // other table name              // 
                localField: "zones_id",   // name of users table field     //
                foreignField: "_id",     // name of userinfo table field  // 
                as: "zones_info"        // alias for userinfo table      //
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$zones_info" }, 
        {   
            $lookup:{
                from: "circles",       // other table name  
                localField: "circles_id",   // name of users table field 
                foreignField: "_id", // name of userinfo table field    
                as: "circle_info"         // alias for userinfo table
            }  
        },// define which fields are you want to fetch    
        {   $unwind:"$circle_info" },  
        {   
            $lookup:{
                from: "wards",       // other table name
                localField: "ward_id",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "wards_info"         // alias for userinfo table
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$wards_info" },  
        {   
            $lookup:{
                from: "landmarks",       // other table name
                localField: "landmark_id",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "landmarks_info"         // alias for userinfo table
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$landmarks_info" },  
        
        {   
            $project:{ 

                _id : 1,  
               
                zone_name : "$zones_info.name", 
                circle_name : "$circle_info.name", 
                wardname : { $concat: [ "$wards_info.wards_no", " - ", "$wards_info.name" ] },  
                landmark : { $concat: [ "$landmarks_info.landmark_from", " - ", "$landmarks_info.landmark_to" ] },
                owner_type:1,
                vehicle_type:1,
                vehicle_registration_number:1,
                transfer_station:1,
                unique_no:1,
                driver_name:1,
                driver_number:1,
            }
            
        },{ $skip: pc1 }, { $limit: 10 }
    ]);
    

   var table_arr =['Zone','Circle','Ward','Landmark','Owner type','Vehicle type','Vehicle No','Driver Name','Driver Mobile',
     'Transfer Station']; 

    async function processtrips(data){
        var finaldata = []; 
        var i; 
       for(i=0; i<alldata.length; i++){
    
              let gd = {...alldata[i]}; 
              gd ={zone_name:gd.zone_name,circle_name:gd.circle_name,wardname:gd.wardname,landmark:gd.landmark,owner_type:gd.owner_type,
                vehicle_type:gd.vehicle_type,vehicle_registration_number:gd.vehicle_registration_number,driver_name:gd.driver_name
            ,driver_number:gd.driver_number,transfer_attached:gd.transfer_station }; 
              gd['arr'] =[]; 
     
        await Promise.all(dates_search.map( async(da,dind)=>{
    
        //   console.log(da); 
           let t_count = await transfer_station.find({vechile_type:da,import_data_unique_no:alldata[i].unique_no}).countDocuments();
             if(i==0){
                table_arr.push('Date & time');
                table_arr.push('Weight');
                table_arr.push('Date');
             } 
        
            if(t_count >= 1){
               // console.log(da); 
              
                const cc =   await transfer_station.aggregate([
                    { "$match": {vechile_type:da,import_data_unique_no:alldata[i].unique_no} },
                    {
                        $group: {_id: 1,"TotalAmount": {$sum: "$wastage_weight"}}
                    } 
                ]); 
                let t_count_data = await transfer_station.find({vechile_type:da,import_data_unique_no:alldata[i].unique_no}).exec();
              //  console.log('hi'); 
               let oj ={date_time:t_count_data[0].log_date_created,  weight:cc[0].TotalAmount, image:t_count_data[0].image,date:t_count_data[0].vechile_type,ind:dind}
                gd['arr'].push(oj); 
         
               
            }
             if(t_count == 0){
          
                let oj ={date_time:'-',  weight:'', image:'',date:da,ind:dind}
                gd['arr'].push(oj);  
             
            }
        }))
    
        finaldata.push(gd);  
       }

        return finaldata; 
      
      
   }
   
//    async function sendRequest(da,un){
//     console.log(da+' - '+un); 
//  let t_count = await transfer_station.find({vechile_type:da,import_data_unique_no:un}).countDocuments();
 
//      return t_count; 

  
// }



   let userToken = processtrips(1);
//  console.log(alldata); 
    userToken.then(function(result) {
      //  console.log(result) // "Some User token"
        res.status(200).send({success:true,data:result,table_arr,count:{totalC,page}})
    })
     

  //  return res.status(200).send({alldata}); 

      
} 




