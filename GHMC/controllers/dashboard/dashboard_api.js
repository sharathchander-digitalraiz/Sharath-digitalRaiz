const Zones = require('../../model/zones'); 
const Circles = require('../../model/circles'); 
const Wards = require('../../model/wards');
const Areas = require('../../model/area');
const Landmarks = require('../../model/landmarks'); 
const User = require('../../model/users');
const Vehicle_attendance = require('../../model/vehicles_attandance');
const Transfer_station = require('../../model/transferstation'); 
const Temple = require('../../model/temple'); 
const Manhole_tree = require('../../model/man_hole_tree_busstop'); 
const Parking = require('../../model/parking'); 
const Toilets = require('../../model/toilets'); 
const Community_hall = require('../../model/communityhall'); 
const Street_vendor = require('../../model/streetvendor'); 
const Residential_house = require('../../model/residential_house'); 
const Complex_building = require('../../model/complex_building'); 
const Operations = require('../../model/operations'); 
const Toiletsoperation = require('../../model/toilets_operations'); 
const Culvert_issue = require('../../model/culvertissue'); 
const Gvpbeptrips = require('../../model/garbagetrips'); 
const multer = require('multer'); 
var randomColor = require('randomcolor');
const Department=require("../../model/department");
const Useraccess=require("../../model/useraccess");
const mongoose = require('mongoose'); 
const ObjectId = mongoose.Types.ObjectId;
const culvertIssueMain=require("../../model/culvert_Issue_main");


exports.admin_dashboard_all_data = async(req,res)=>{
  
    const { tenent_id,access_type,zones_id } = req.body; 
   // let currentDate = new Date();
   // let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
   // console.log(time); 
   let final_object ={};  

   let current_datetime = new Date();
    let s = new String(current_datetime.getDate());
    let cd; 	
	if(s.length == 1){
	      cd = '0'+s;
    }else{
	       cd = current_datetime.getDate(); 
	} 
    let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;
 
   
    const zones_count  = await Zones.find({tenent_id: tenent_id}).countDocuments(); 
    const circle_count = await Circles.find({tenent_id: tenent_id}).countDocuments(); 
    const ward_count   = await Wards.find({tenent_id: tenent_id}).countDocuments();  
    const area_count   = await Areas.find({tenent_id: tenent_id}).countDocuments();  
    const land_count   = await Landmarks.find({tenent_id: tenent_id}).countDocuments();
    const user_count   = await User.find({tenent_id: tenent_id}).countDocuments(); 
    const count_details    =  { zones_count,circle_count,ward_count,area_count,land_count,user_count }
    final_object['total_count'] = count_details; 

    

    /* Zone Wise */
    const zones_details = await Zones.find({tenent_id: tenent_id},{name:1}).exec();
     /* Circle Wise */ 
    const circle_details = await Circles.find({tenent_id: tenent_id,zones_id:zones_id},{_id:1,name:1}).exec();

   async function processtrips(data){
       const final_array = []; 
       /*default values push */
       const zonewise_details1 = {
        'name' : "", 
        'value': 0, 
        'type':"Zero"
        }
        const zonewise_not_attenddetails1 = {
            'name' :"", 
            'value': 0, 
            'type':"Not-Zero"
        }
        final_array.push(zonewise_details1); 
       final_array.push(zonewise_not_attenddetails1);

       await Promise.all(zones_details.map(async (val,i)=>{
        var color = randomColor();
        let  total;
        let  not_attend;
        let  total_count; 

        if(access_type == 'church_masjid_temple'){
            total_count = await Temple.find({zones_id:val._id}).countDocuments(); 
            total =  await Operations.find({zones_id:val._id,date:formatted_date,db_type:'temples'}).countDocuments();
            not_attend = total_count - total;  

        }else if(access_type == 'manhole_tree_busstop'){
            total_count = await Manhole_tree.find({zones_id:val._id}).countDocuments(); 
            total =  await Operations.find({zones_id:val._id,date:formatted_date,db_type:'man_hole_tree_busstops'}).countDocuments();
            not_attend = total_count - total;  
        }
        else if(access_type == 'parking'){
            total_count = await Parking.find({zones_id:val._id}).countDocuments(); 
            total =  await Operations.find({zones_id:val._id,date:formatted_date,db_type:'parkings'}).countDocuments();
            not_attend = total_count - total;   
        }
        else if(access_type == 'toilets'){
            total_count = await Toilets.find({zones_id:val._id}).countDocuments(); 
            total =  await Toiletsoperation.find({zones_id:val._id,date:formatted_date}).countDocuments();
            not_attend = total_count - total; 
        }  
        else if(access_type == 'community_hall'){ 
            total_count = await Community_hall.find({zones_id:val._id}).countDocuments(); 
            total =  await Operations.find({zones_id:val._id,date:formatted_date,db_type:'communityhalls'}).countDocuments();
            not_attend = total_count - total; 
        }
        else if(access_type == 'street_vendor'){ 
            total_count = await Street_vendor.find({zones_id:val._id}).countDocuments(); 
            total =  await Operations.find({zones_id:val._id,date:formatted_date,db_type:'streetvendors'}).countDocuments();
            not_attend = total_count - total; 
        }
        else if(access_type == 'individual_home_house'){  
            total_count = await Residential_house.find({zones_id:val._id}).countDocuments(); 
            total =  await Operations.find({zones_id:val._id,date:formatted_date,db_type:'residential_houses'}).countDocuments();
            not_attend = total_count - total; 
        }
        else if(access_type == 'complex_building'){
            total_count = await Complex_building.find({zones_id:val._id}).countDocuments(); 
            total =  await Operations.find({zones_id:val._id,date:formatted_date,db_type:'comercial_buildings'}).countDocuments();
            not_attend = total_count - total;   
        }else{   
            total = await Vehicle_attendance.find({zones_id:val._id,date:formatted_date,attandance:1}).countDocuments();
            not_attend = await Vehicle_attendance.find({zones_id:val._id,date:formatted_date,attandance:0}).countDocuments();
        }
        
        const zonewise_details = {
            'name' : val.name, 
            'value': total, 
            'type':"Attend"
        }
        const   zonewise_not_attenddetails = {
            'name' : val.name, 
            'value': not_attend, 
            'type':"Not-Attend"
        }
        final_array.push(zonewise_details); 
        final_array.push(zonewise_not_attenddetails); 
    }))
    return final_array; 
   }

   let userToken = processtrips(1);
   userToken.then(async function(result) {
           final_object['zoneswise'] = result; 
            let userToken_circle = processtrips_circle(1);
            userToken_circle.then(async function(result)
             {
            final_object['circlewise'] = result; 
                        let transfer_circle_details = transfer_user(1);
                        transfer_circle_details.then(async function(result)
                         {
                            final_object['transferstaion_user'] = result; 
                            return res.status(200).send({login:true,success:true,data:final_object })
                        }) 
            }) 
   })            
   
   
 

   async function processtrips_circle(data){
       const final_array1 = []; 
       await Promise.all(circle_details.map(async (val,i)=>{
        var color = randomColor();
        let total;  
        let not_attend;  
        let total_count; 
        if(access_type == 'church_masjid_temple'){
            total_count = await Temple.find({circles_id:val._id}).countDocuments(); 
            total =  await Operations.find({circles_id:val._id,date:formatted_date,db_type:'temples'}).countDocuments();
            not_attend = total_count - total; 
        }else if(access_type == 'manhole_tree_busstop'){
            total_count = await Manhole_tree.find({circles_id:val._id}).countDocuments(); 
            total =  await Operations.find({circles_id:val._id,date:formatted_date,db_type:'man_hole_tree_busstops'}).countDocuments();
            not_attend = total_count - total;
        }else if(access_type == 'parking'){
            total_count = await Parking.find({circles_id:val._id}).countDocuments(); 
            total =  await Operations.find({circles_id:val._id,date:formatted_date,db_type:'parkings'}).countDocuments();
            not_attend = total_count - total;
        }else if(access_type == 'toilets'){ 
            total_count = await Toilets.find({circles_id:val._id}).countDocuments(); 
            total =  await Toiletsoperation.find({circles_id:val._id,date:formatted_date}).countDocuments();
            not_attend = total_count - total;
        } else if(access_type == 'community_hall'){
            total_count = await Community_hall.find({circles_id:val._id}).countDocuments(); 
            total =  await Operations.find({circles_id:val._id,date:formatted_date,db_type:'communityhalls'}).countDocuments();
            not_attend = total_count - total;
        } 
        else if(access_type == 'street_vendor'){
            total_count = await Street_vendor.find({circles_id:val._id}).countDocuments(); 
            total =  await Operations.find({circles_id:val._id,date:formatted_date,db_type:'streetvendors'}).countDocuments();
            not_attend = total_count - total;
        }
        else if(access_type == 'complex_building'){
            total_count = await Complex_building.find({circles_id:val._id}).countDocuments(); 
            total =  await Operations.find({circles_id:val._id,date:formatted_date,db_type:'comercial_buildings'}).countDocuments();
            not_attend = total_count - total;
        }
        else if(access_type == 'individual_home_house'){
            total_count = await Residential_house.find({circles_id:val._id}).countDocuments(); 
            total =  await Operations.find({circles_id:val._id,date:formatted_date,db_type:'residential_houses'}).countDocuments();
            not_attend = total_count - total;
        }else{ 
            total = await Vehicle_attendance.find({circles_id:val._id,date:formatted_date,attandance:1}).countDocuments();
            not_attend = await Vehicle_attendance.find({circles_id:val._id,date:formatted_date,attandance:0}).countDocuments();
        }
        const circlewise_details = {
            'label' : val.name,
            'value': total,
            //'color':color
        }
        final_array1.push(circlewise_details); 

        const circlewise_not_details = {
            'label' : val.name,
            'value': not_attend,
            //'color':color
        }
        final_array1.push(circlewise_not_details); 
    }))
    return final_array1; 
   } 

   
  
   
  
   /* Transfer Station */
   async function transfer_user(data){
    const user_data = await User.find({department_id:'618588f8a5d1f1e87a1f6bb3',tenent_id: tenent_id},{last_name:1}).exec();
  
    const final_array2 = []; 
    await Promise.all(user_data.map(async (val,i)=>{
        var color = randomColor();
     const total_count = await Transfer_station.find({date:formatted_date,user_id:val._id}).countDocuments();
    
     const transfer_details = { 
         'label' : val.last_name,
         'value': total_count,
          'color':color
     }
     final_array2.push(transfer_details); 
 }))
 return final_array2; 
}

}


exports.culvert_issue_admin_dash = async(req,res)=>{
   const { tenent_id,user_id} = req.body; 
    let current_datetime = new Date();
    let s=new String(current_datetime.getDate());
 let M = new String(current_datetime.getMonth() + 1);
 let cd; 	
 let mn; 
 if(s.length == 1)
 {
       cd = '0'+s;
 }
 else
 {
       cd = current_datetime.getDate(); 
 }
 if(M.length == 1)
 {
       mn = '0'+M;
 }
 else
 {
     mn = current_datetime.getMonth() + 1 
 }

    let formatted_date =   current_datetime.getFullYear() + "-" +mn+ "-" +cd;
    console.log(formatted_date);
    let acc_dep_data = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec();
    let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
    console.log(role_data.name);
    if(role_data.name == 'Admin'){
        
    const circle_details = await Circles.find({tenent_id: tenent_id},{_id:1,name:1}).exec();
    async function processtrips(data){
        let total_data = {}; 
        circlearr = []; 
        total_data['circles']=[];
        let finalarr = [{seriesname: "Green",color:"#008000",data: []},
        {seriesname: "Red",color:"#ff0000",data: []},{seriesname: "Orange",color:"#FF8C00",data: []}];

        await Promise.all(circle_details.map(async (val)=>{
            let green=0;
            let red=0;
            let orange=0; 
            circlearr.push({label:val.name }); 
            var CulvertIssueData= await culvertIssueMain.find({circle_id:val._id,date:formatted_date}).exec();
            console.log("CulvertIssueData");
            console.log(CulvertIssueData);
            await Promise.all(CulvertIssueData.map(async (issueData)=>{ 
            console.log(issueData);
            console.log("issueData");
             if(issueData.type=='green')
             {
                green=(issueData.date==formatted_date)?green+1:green;  
             }
             if(issueData.type=='red' && issueData.solved_color=="")
             {
                red=(issueData.solved_color=='-'  || issueData.solved_color=="")?red+1:red;
            }
            else if(issueData.type=='red' && issueData.solved_color!="")
            {
                green=(issueData.date==formatted_date)?green+1:green;  
            }             
             if(issueData.type=='orange')
            {
               console.log(issueData.solved_color);
               orange=(issueData.solved_color=='-' || issueData.solved_color=="")?orange+1:orange;
            }
           }));

           finalarr[0]['data'].push({value: green});
           finalarr[1]['data'].push({value: red});
           finalarr[2]['data'].push({value: orange});
           total_data['circles'].push({label:val.name});
        }));
        console.log("circlearr");
        console.log(circlearr);
       //  total_data['circles'] = circlearr;  
         total_data['dataset']=finalarr;
       
       return total_data;
    } 
  

    let result_culvert_issue = processtrips(1);   
        //  console.log(alldata);  
    result_culvert_issue.then(function(result) {    
      //  console.log(result);       
      return res.status(200).send({"type":role_data.name,"success":true,"login":true,"message":'Successfully completed',data:result}); 
    }) 
      
    }
    else
    {
        const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
       // const circle_details = access_data.circles;
        const circle_details = await access_data.circles.map((val)=>{
            return ObjectId(val);
        })
      //  console.log("circle_details");
      //  console.log(circle_details);
        async function processtrips(data){
            let total_data = {}; 
            total_data['circles']=[];
            circlearr = []; 

            let finalarr = [{seriesname: "Green",color:"#008000",data: []},
            {seriesname: "Red",color:"#ff0000",data: []},{seriesname: "Orange",color:"#FF8C00",data: []}]; 
             var i=0;
            await Promise.all(circle_details.map(async (val)=>{ 
                const circleData = await Circles.findOne({_id: val},{_id:1,name:1}).exec();


                let green=0;
                let red=0;
                let orange=0; 
                circlearr.push({label:circleData.name}); 
               var CulvertIssueData= await culvertIssueMain.find({circle_id:val,"type": { $ne: ""  }});
             //  console.log(CulvertIssueData);
               CulvertIssueData.map(async (issueData)=>{ 
             //   console.log(issueData.type);
             console.log(issueData.solved_color);
                 if(issueData.type=='green')
                 {
                    green=(issueData.date==formatted_date)?green+1:green;    
                 }
                 else if(issueData.type=='red' && issueData.solved_color=="")
                 {
                    red=(issueData.solved_color=='-'  || issueData.solved_color=="")?red+1:red;
                 }
                 else if(issueData.type=='red' && issueData.solved_color!="")
                 {
                    green=(issueData.date==formatted_date)?green+1:green; 
                 }
                 else if(issueData.type=='orange')
                 {
                    console.log(issueData.solved_color);
                    orange=(issueData.solved_color=='-' || issueData.solved_color=="")?orange+1:orange;
                 }
               });
               finalarr[0]['data'].push({value: green});
               //finalarr[0]['data'].push({value: green,name:circleData.name});
               finalarr[1]['data'].push({value: red});
              // finalarr[1]['data'].push({value: red,name:circleData.name});
               finalarr[2]['data'].push({value: orange});
              //finalarr[2]['data'].push({value: orange,name:circleData.name});
            //   total_data['circles'][i]['label'] =circleData.name; 
            total_data['circles'].push({label:circleData.name});
               i++; 
        }));

        

               
             total_data['dataset']=finalarr;
           
          
           return total_data;
        } 
      
       // console.log(result);
        let result_culvert_issue = processtrips(1);   
            console.log(result_culvert_issue);  
        result_culvert_issue.then(function(result) {    
            console.log(result);       
          return res.status(200).send({"type":role_data.name,"success":true,"login":true,"message":'Successfully completed',data:result}); 
        }) 
        
    }




} 


exports.admin_gvp_bep_dash = async(req,res)=>{
    const {tenent_id} = req.body; 
   
    const circle_details = await Circles.find({tenent_id: tenent_id},{_id:1,name:1}).exec();
    async function processtrips(data){
        let total_data = {}; 
        let circlearr=[]; 
        let finalarr = [{seriesname: "GVP",data: []},{seriesname: "BEP",data: []}]; 
        await Promise.all(circle_details.map(async (val)=>{ 
            await  Gvpbeptrips.find({type:{$in:['Gvp','GVP']},circle_id:val._id  }).countDocuments().then(async(gvp)=>{
                circlearr.push({label:val.name }); 
                finalarr[0]['data'].push({value: gvp});
                await Gvpbeptrips.find({type:{$in:['Bep','BEP']},circle_id:val._id  }).countDocuments().then((bep)=>{
                    finalarr[1]['data'].push({value: bep});
                })
            })
        })); 
        total_data['circles'] = circlearr;
        total_data['dataset'] = finalarr;
        return total_data; 
    }
    let result_gvpbep = processtrips(1);   
    //  console.log(alldata);  
    result_gvpbep.then(function(result) {    
    //  console.log(result);       
    return res.status(200).send({"success":true,"login":true,"message":'Successfully completed',data:result}); 
    }) 
}
 





var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    {
      cb(null, './uploads/')
    },
    filename: (req, file, cb) =>  
    {
      cb(null,  Date.now() + '-' + file.originalname)
    }
  });
  
  exports.upload = multer({storage: storage});  
