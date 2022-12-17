const Culvert = require('../../model/culvert'); 
const Culvert_issue = require('../../model/culvertissue'); 
const Culvert_solved = require('../../model/culvertsolved'); 
const Useraccess = require('../../model/useraccess'); 
const Circles = require('../../model/circles'); 
const User    = require('../../model/users'); 
const Department = require('../../model/department'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;
var fs   = require('fs');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name'); 

const culvertIssueMain=require("../../model/culvert_Issue_main");

exports.culvert_issue_report = async(req,res)=>{
    const { user_id,tenent_id } = req.body;
    let acc_dep_data = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
    let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
    let current_datetime = new Date();
    let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate();
    if(role_data.name == 'Admin'){
            let userToken = "";
            let newobject = {}; 
            if(req.body.tenent_id != '' && req.body.tenent_id != undefined){
                newobject['tenent_id'] = ObjectId(req.body.tenent_id); 
            }
            const culvert_data = await Culvert.find(newobject).exec(); 
            // console.log(culvert_data);

            async function processculvert_issue(data){
                let finaldata = []; 
               await Promise.all(culvert_data.map( async(val)=>{
                   // console.log(val); 
                    let culvert_obj = {zone:val.zone,circle:val.circle,ward:val.ward,area:val.area,
                        landmark:val.landmark,culvertName:val.name,culvertType:val.type}; 
                    const count_issue  =   await culvertIssueMain.find({culvert_id:val._id,date:formatted_date}).countDocuments();
                    if(count_issue > 0){
                        const issue_data =  await culvertIssueMain.findOne({culvert_id:val._id,date:formatted_date}).exec();

                        culvert_obj['visit_date'] = (issue_data.date!="")?issue_data.date:'-';
                        culvert_obj['visit_image'] = (issue_data.image!="")?issue_data.image:'-';
                        culvert_obj['reported_depth'] = (issue_data.issue_depth!="")?issue_data.issue_depth:'-'; 
                        culvert_obj['reported_status'] = (issue_data.status!="")?issue_data.status:'-';
                        culvert_obj['color'] = (issue_data.type!="")?issue_data.type:'-';
                        
                        culvert_obj['resolved_date']   = (issue_data.solved_date!="" && issue_data.solved_date!=undefined)?issue_data.solved_date:'-';
                        culvert_obj['resolved_image']  = (issue_data.solved_image!="" && issue_data.solved_image!=undefined)?issue_data.solved_image:'-';
                        culvert_obj['resolved_status'] = (issue_data.status!="" && issue_data.status!=undefined)?issue_data.status:'-';
                        culvert_obj['resolved_user']   = (issue_data.user_id!="" && issue_data.user_id!=undefined)?issue_data._user_id:'-';
                        culvert_obj['resolved_color'] = (issue_data.solved_color!="" && issue_data.solved_color!=undefined)?issue_data.solved_color:'-';
                       
                    }else{
                        culvert_obj['visit_date']      = '-';   
                        culvert_obj['visit_image']     = '-';    
                        culvert_obj['reported_depth']  = '-'; 
                        culvert_obj['reported_status'] = '-';
                        culvert_obj['color'] ="-";
                        culvert_obj['resolved_date']   = '-';
                        culvert_obj['resolved_image']  = '-'; 
                        culvert_obj['resolved_status'] = '-';
                        culvert_obj['resolved_user']   = '-';
                        culvert_obj['resolved_color'] = '-';    
                    }
                   
                    finaldata.push(culvert_obj); 
               }));
                return finaldata; 
            }
            
             userToken = await processculvert_issue(1);
 
          //  userToken.then(function(result) {
                res.status(200).send({login:true,status:true,result:userToken}) 
            //}); 
    }else{
        // console.log('not admin'); 
        const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
           // console.log(access_data); 
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
            newobject.zone_id = {$in: acc_zones};
            newobject.circle_id = {$in: acc_circles};
            newobject.ward_id = {$in: acc_wards};
            newobject.area_id = {$in: acc_areas};
           // newobject.landmark_id = {$in: acc_landmark}; 
          // console.log(newobject); 
            const culvert_data = await Culvert.find(newobject).exec(); 
            let userToken='';
            async function processculvert_issue(data){
                let finaldata = []; 
               await Promise.all(culvert_data.map( async(val)=>{
                   // console.log(val); 
                    let culvert_obj = {zone:val.zone,circle:val.circle,ward:val.ward,area:
                        val.area,landmark:val.landmark,culvertName:val.name,culvertType:val.type}; 
                    
                        const count_issue  =   await culvertIssueMain.find({culvert_id:val._id,date:formatted_date}).countDocuments();
                        if(count_issue > 0){
                            const issue_data =  await culvertIssueMain.findOne({culvert_id:val._id,date:formatted_date}).exec();
                        culvert_obj['visit_date'] = (issue_data.log_date_created!="" && issue_data.log_date_created!=undefined)?issue_data.log_date_created:'-';
                        culvert_obj['visit_image'] = (issue_data.image!=""&& issue_data.image!=undefined)?issue_data.image:'-';
                        culvert_obj['reported_depth'] = (issue_data.issue_depth!="" && issue_data.issue_depth!=undefined)?issue_data.issue_depth:'-'; 
                        culvert_obj['reported_status'] = (issue_data.status!="" && issue_data.status!=undefined)?issue_data.status:'-';
                        culvert_obj['color'] = (issue_data.type!="" && issue_data.type!=undefined)?issue_data.type:'-';
                        
                        culvert_obj['resolved_date']   = (issue_data.solved_date!="" && issue_data.solved_date!=undefined)?issue_data.solved_date:'-';
                        culvert_obj['resolved_image']  = (issue_data.solved_image!="" && issue_data.solved_image!=undefined)?issue_data.solved_image:'-';
                        culvert_obj['resolved_status'] = (issue_data.status!="" && issue_data.status!=undefined)?issue_data.status:'-';
                        culvert_obj['resolved_user']   = (issue_data.user_id!="" && issue_data.user_id!=undefined)?issue_data._user_id:'-';
                        culvert_obj['resolved_color'] = (issue_data.solved_color!="" && issue_data.solved_color!=undefined)?issue_data.solved_color:'-';
                        }
                        else
                        {
                            culvert_obj['visit_date']      = '-';   
                            culvert_obj['visit_image']     = '-';    
                            culvert_obj['reported_depth']  = '-'; 
                            culvert_obj['reported_status'] = '-';
                            culvert_obj['color'] ="-";
                            culvert_obj['resolved_date']   = '-';
                            culvert_obj['resolved_image']  = '-'; 
                            culvert_obj['resolved_status'] = '-';
                            culvert_obj['resolved_user']   = '-';
                            culvert_obj['resolved_color'] = '-';    
                        }
                    finaldata.push(culvert_obj); 
               }));
                return finaldata; 
            }
            
            userToken = await processculvert_issue(1);
 
           // userToken.then(function(result) {
                res.status(200).send({login:true,status:true,result:userToken}) 
           // });
    }
}   

exports.culvert_issue_report_search = async(req,res)=>{ 
       const { user_id,zones_id,circles_id,ward_id,areas_id,status,date1,date2} = req.body;  
       let acc_dep_data = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
       let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
        let newobject ={};   
        let issueObject ={}; 
        var dates=[];
        var type='';
        var circles = [];
        var head=[];
        head.push("zone","circle","ward","area","landmark","culvertName","culvertType");
        if(date2!=date1)
        {
            dates=await getDateRange(new Date(date1), new Date(date2));
            await Promise.all(dates.map( async(da,l)=>{
                const datse=new Date(da).toISOString().replace(/T/, ' ').replace(/\..+/, '').substr(0, 10);
                head.push(datse);
                }));
           // dates=datse.sort();
        }
        else
        {
            head.push("visit date","visit image","color","resolved date","resolved image",
            "resolved color");
        }
        if(zones_id != '' && zones_id != undefined && zones_id!="All"){
            newobject['zone_id'] = ObjectId(zones_id); 
            issueObject['zone_id'] = ObjectId(zones_id); 
        }
        else
        { 
            if(role_data.name!='Admin')
            {
                const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
                ///var zones=access_data.zones;
                var   zones = access_data['zones'].map((val)=>{
                return ObjectId(val);
                })
                newobject.zone_id = {$in: zones};
                issueObject.zone_id = {$in: zones};
            }
        }

        if(circles_id != '' && circles_id != undefined && circles_id!="All"){

            newobject['circle_id'] = ObjectId(circles_id); 
            issueObject['circle_id'] = ObjectId(circles_id); 
        } 
        else
        { 
            if(role_data.name!='Admin')
            {
                   const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
                   //console.log(access_data.circles);
                    access_data['circles'].forEach(function (item) {
                      circles.push(ObjectId(item));
                    });
                   newobject.circle_id = {$in: circles};
                   issueObject.circle_id = {$in: circles};
            }
        }
        if(ward_id != '' && ward_id != undefined && ward_id!="All"){
            newobject['ward_id'] = ObjectId(ward_id); 
            issueObject['ward_id'] = ObjectId(ward_id); 
        } 
        else
        { 
            if(role_data.name!='Admin' )
            {
                   const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
                   var  ward = access_data['ward'].map((val)=>{
                    return ObjectId(val);
                   })
                   newobject.ward_id = {$in: ward};
                   issueObject.ward_id = {$in: ward};
            }
        } 
        if(areas_id != '' && areas_id != undefined && areas_id!="All"){
            newobject['area_id'] = ObjectId(areas_id); 
            issueObject['area_id'] = ObjectId(areas_id); 
        }
        else
        {    
            if(role_data.name!='Admin' )
            {
                const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
                var  areas = access_data['areas'].map((val)=>{
                    return ObjectId(val);
                   })
                newobject.area_id = {$in: areas};
                issueObject.area_id = {$in: areas};
            }
        }
            let userToken='';
            if(date1==date2)
            {
                type='today';
            }
            else
            {
                type='days';
            }
            console.log(status);
            switch(status){
                case "All":
                userToken= await alldata(issueObject,date1,date2,dates);
                break;
                case "pending":
                userToken= await Pendingdata(issueObject,date1,date2,type,dates,status);
                break;
                case "Solved":
                userToken= await Pendingdata(issueObject,date1,date2,type,dates,status);
                break;
            }
               // res.status(200).send({login:true,status:true,result:userToken,"headers":head,'type':type});
             res.status(200).send({login:true,status:true,result:userToken,'type':type,"headers":head});
}

exports.culvertAppIssueDashboard = async(req,res)=>{  
    const { user_id,tenent_id } = req.body;
    let result = []; 
    let acc_dep_data = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
    let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
    console.log(role_data);
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
    var formatted_date= current_datetime.getFullYear() + "-" + mn+ "-" +cd;
    if(role_data.name == 'Admin'){
        let CirclesData = await Circles.find({tenent_id:tenent_id}).exec();  
        await Promise.all(CirclesData.map( async(cdata)=>{
            let newobject ={};
            let redissues = await culvertIssueMain.find({type:"red",circle_id:cdata._id,date:formatted_date}).countDocuments();  
            let orangeissues = await culvertIssueMain.find({type:"orange",circle_id:cdata._id,date:formatted_date}).countDocuments();  
            let greenissues = await culvertIssueMain.find({type:"green",circle_id:cdata._id,date:formatted_date}).countDocuments();  
            newobject.id=cdata._id;
            newobject.name=cdata.name;
            newobject.green=greenissues;
            newobject.orange=orangeissues;
            newobject.red=redissues;
            newobject.url="http://103.171.181.73:2000/culvertAppCircleIssueSDownload/"+cdata._id;
            result.push(newobject);
        }));
    }
    else
    { 
        const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
        console.log(access_data.circles);
        const cData=access_data.circles;
        await Promise.all(cData.map( async(cdata)=>{
            let newobject ={};
            let CirclesData = await Circles.findOne({tenent_id:tenent_id,_id:cdata}).exec(); 
            let redissues = await culvertIssueMain.find({type:"red",circle_id:cdata,date:formatted_date}).countDocuments();  
            let orangeissues = await culvertIssueMain.find({type:"orange",circle_id:cdata,date:formatted_date}).countDocuments();  
            let greenissues = await culvertIssueMain.find({type:"green",circle_id:cdata,date:formatted_date}).countDocuments();  
            newobject.id=cdata;
            newobject.name=CirclesData.name;     
            newobject.green=greenissues;
            newobject.orange=orangeissues;
            newobject.red=redissues;
            newobject.url="http://103.171.181.73:2000/culvertAppCircleIssueSDownload/"+cdata;
            result.push(newobject);
        }))
    }
    res.status(200).send({login:true,status:true,"message": "Successfully completed",data:result}) 
}

exports.culvertAppCircleIssueSDownload = async(req,res)=>{  
    let current_datetime = new Date();
    let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate();
    const circleId=req.params.circleId;
    console.log("circleId");
    const headingColumnNames_sat = ['Zone/Municipality','Circle/Vilage','Ward Name','Area','Landmark',
    'Culvert Name','Culvert Type','Visit date',"Color","Resolved date","Resolved color"];
    const final_array_sat = []; 

    const CulvertData = await Culvert.find({circle_id:circleId}).exec(); 

    await Promise.all(CulvertData.map( async(data,index)=>{
        const CulvertIssuesData = await culvertIssueMain.findOne({culvert_id:data._id,date:formatted_date}).exec(); 
         let object={"zone":data.zone,"circle":data.circle,
         "ward":data.ward,"area":data.area,"landmark":data.landmark,
         "cullvertName":data.name,"CulvertType":data.type,"Visit date":CulvertIssuesData.status,"Color":CulvertIssuesData.color,
         "Resolved date":CulvertIssuesData.solved_date,"Resolved color":CulvertIssuesData.solved_color};
         final_array_sat.push(object);   
    }));
    let headingColumnIndex = 1;
    headingColumnNames_sat.forEach(heading => {
    ws.cell(1, headingColumnIndex++) 
        .string(heading)
    });


    //Write Data in Excel file
    let rowIndex = 2;
    final_array_sat.forEach( record => {
    let columnIndex = 1;
    Object.keys(record ).forEach(columnName =>{
        ws.cell(rowIndex,columnIndex++)
            .string(record [columnName])
    });
    rowIndex++;
    });  
   
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var time  = d.getTime(); 
    const  image_path='uploads/excel/culvert/';
    fs.mkdir(image_path, function(err) {});   
    fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});
   const  filename =year+'-'+month+'-'+date+'_'+CulvertData[0]['circle']+'_culvertData.xlsx'; 
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + filename
    );
   
    await wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);
    await sleep(5000);
    res.download(image_path+year+'-'+month+'-'+date+'/'+filename);

}
exports.culvertDownloadAppDashboard = async(req,res)=>{  
    const {user_id,zone_id,circle_id,status,start_date,end_date}=req.body;
    const headingColumnNames_sat = ['Zone/Municipality','Circle/Vilage','Ward Name','Area','Landmark',
    'Culvert Name','Culvert Type','Status','Date'];

    const final_array_sat = []; 
    let condition ={};
    if(zone_id!='All')
    {
        condition.zone_id=zone_id;
    }
    if(circle_id!='All')
    {
        condition.circle_id=circle_id;
    }
    if(status!='All')
    {
        condition.status=status;
    }
    //condition.log_date_created={$gte: start_date, $lt: end_date};
    const CulvertData = await Culvert.find(condition).exec(); 
    await Promise.all(CulvertData.map( async(data,index)=>{
            const CulvertIssuesData = await Culvert_issue.findOne({culvert_id:data._id,
            log_date_created:{$gte: start_date, $lt: end_date}}).sort({_id:-1}).exec();
            const CulvertIssuesDocuments = await Culvert_issue.findOne({culvert_id:data._id,
                log_date_created:{$gte: start_date, $lt: end_date}}).sort({_id:-1}).countDocuments();
            var date=''; 
            var status=''; 
            if(CulvertIssuesDocuments>0)
            {
                date= new Date(CulvertIssuesData.log_date_created).toISOString().replace(/T/, ' ').replace(/\..+/, '')
                status=CulvertIssuesDocuments.status;
            }
            else
            {
                date=''; 
                status='';
            }

          
         let object={"zone":data.zone,"circle":data.circle,
         "ward":data.ward,"area":data.area,"landmark":data.landmark,
         "cullvertName":data.name,"CulvertType":data.type,"Status":status,"Date":date};
         final_array_sat.push(object);   
    }));
    let headingColumnIndex = 1;
    headingColumnNames_sat.forEach(heading => {
    ws.cell(1, headingColumnIndex++) 
        .string(heading)
    });


    //Write Data in Excel file
    let rowIndex = 2;
    final_array_sat.forEach( record => {
    let columnIndex = 1;
    Object.keys(record ).forEach(columnName =>{
        ws.cell(rowIndex,columnIndex++)
            .string(record [columnName])
    });
    rowIndex++;
    });  
   
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var time  = d.getTime(); 
    const  image_path='uploads/excel/culvert/';
    fs.mkdir(image_path, function(err) {});   
    fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});
    //console.log(CulvertIssuesData);
   const  filename ="search_"+year+'-'+month+'-'+date+'_'+CulvertData[0]['circle']+'_culvertData.xlsx'; 
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + filename
    );
   var resu= await wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);
   console.log("resu");
   console.log(resu);
   await sleep(1000);
   res.download(image_path+year+'-'+month+'-'+date+'/'+filename);
   // });
   

}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 


  async function alldata(issueObject,date1,date2,dates)
  {
    const CulvertData = await Culvert.find(issueObject).sort({name:-1}).exec();

    async function processculvert_issue(data){
        let finaldata = [];  
    await Promise.all(CulvertData.map( async(val,i)=>{ 
            let culvert_obj = {zone:val.zone,circle:val.circle,ward:val.ward,area:val.area,
            landmark:val.landmark,culvertName:val.name,culvertType:val.type};
              //  console.log(culvert_obj);
            if(date1==date2)
            {
                var doc=await culvertIssueMain.find({culvert_id:val._id,date:date1},{}).sort({_id:-1}).countDocuments();
                console.log(date1);
                console.log("doc");
                console.log(doc);
                switch(doc){
                    case 0:
                    culvert_obj['visit_date'] = "-";
                    culvert_obj['visit_image'] ="-";
                    culvert_obj['color']        = "-";
                    culvert_obj['resolved_date']   ="-";
                    culvert_obj['resolved_image']  = "-";
                    culvert_obj['resolved_color'] = "-";   
                    break;
                    case 1:
                    var obj=await culvertIssueMain.findOne({culvert_id:val._id,date:date1},{}).exec();
                    culvert_obj['visit_date'] = obj.date;
                    culvert_obj['visit_image'] =obj.image;
                    culvert_obj['color']        = obj.type;
                    culvert_obj['resolved_date']   =obj.solved_date;
                    culvert_obj['resolved_image']  = obj.solved_image;
                    culvert_obj['resolved_color'] = obj.solved_color;
                    break;
                    default:
                    culvert_obj['visit_date'] = "-";
                    culvert_obj['visit_image'] ="-";
                    culvert_obj['color']        = "-";
                    culvert_obj['resolved_date']   ="-";
                    culvert_obj['resolved_image']  = "-";
                    culvert_obj['resolved_color'] = "-"; 
                }
                
                culvert_obj['data']=[];
               
                console.log(culvert_obj);

            }
            else
            {
                culvert_obj["data"]=[];
                await Promise.all(dates.map( async(da,l)=>{
                // type='days';
                //  var df=da;
                    var red=0;
                    var green=0;
                    var orange=0;
                    var df=new Date(da).toISOString().replace(/T/, ' ').replace(/\..+/, '').substr(0, 10);                
                    var oj={
                        "date":df,
                        "red":0,
                        "orange":0,
                        "green":0
                    };
                  
                    var doc=await culvertIssueMain.find({culvert_id:val._id,date:df},{}).countDocuments();
                    console.log(doc);
                    if(doc==0)
                    {
                        oj.red=0;
                        oj.green=0;
                        oj.orange=0; 
                    }
                    else
                    {
                            var obj=await culvertIssueMain.findOne({culvert_id:val._id,date:df},{}).exec();
                            console.log(obj);
                            if(obj.type=="red" && obj.solved_color=="")
                            {
                                oj.red=1;
                            }
                            if(obj.type=="red" && obj.solved_color!=null && obj.solved_color!="")
                            {
                                oj.green=1;
                                console.log("green");
                            }
                            else if(obj.type=="green")
                            {
                                oj.green=1;
                            }
                            else if(val.type=="orange")
                            {
                                oj.orange=1;
                            }
                    }
                    culvert_obj["data"].push(oj);
                    await culvert_obj["data"].sort(compare);
                    }));
            }
        
            finaldata.push(culvert_obj); 
    }));
        return finaldata; 
    }
    return processculvert_issue(1);
  }


  async function Pendingdata(issueObject,date1,date2,type,dates,status)
  {
   
  //  console.log(issueObject);
  issueObject.status=status;
    console.log(type);
    switch(type)
    {
        case "today":
        issueObject.date=date1;
        const data=await culvertIssueMain.find(issueObject,{
        _id:0,
        zone:1,
        circle:1,
        ward:1,
        area:1,
        landmark:1,
        culvertName : "$culvertname",
        culvertType : "$culvertType", 
        visit_date  : "$date",
        visit_image : "$image",
        color : "$type",
        resolved_date :"$solved_date",
        resolved_image :"$solved_image",
        resolved_color :"$solved_color",
        data:[]
            }).exec(); 
       return data;
       break;
       case "days":     
       console.log("issueObject");
       const datse=await Promise.all(dates.map( async(da,l)=>{

       return new Date(da).toISOString().replace(/T/, ' ').replace(/\..+/, '').substr(0, 10);

       }));
       issueObject.date={$in: datse};

       dates=datse.sort();
      
        const fdatas=await culvertIssueMain.aggregate([{"$match": issueObject},
            {"$group": { "_id": { culvert_id: "$culvert_id",_id:"$_id"} }}]);


        const fdata=await Promise.all(fdatas.map( async(da,l)=>{
            return da._id;
            }));
       let finaldata = []; 
      // return fdata;
     // break;
       if(fdata.length>0)
       {
       await Promise.all(fdata.map( async(val)=>{
       // issueObject.culvert_id=val;
        var culvertData=await culvertIssueMain.findOne({_id:val._id},{}).exec(); 
        var culvertta=await Culvert.findOne({_id:val.culvert_id},{}).exec(); 
//console.log(culvertData);
        let culvert_obj = {zone:culvertData.zone,circle:culvertData.circle,ward:culvertData.ward,area:culvertData.area,
            landmark:culvertData.landmark,culvertName:culvertData.culvertname,culvertType:culvertta.type};
            console.log(culvert_obj);
               culvert_obj["data"]=[];
               console.log(dates);
                await Promise.all(dates.map( async(da,l) =>
                    {
                    var df=da;
                    var oj={
                        "date":df,
                        "red":0,
                        "orange":0,
                        "green":0
                    };
                  
                    var doc=await culvertIssueMain.find({_id:val._id,date:df},{}).countDocuments();
                    //console.log(df);
                    if(doc==0)
                    {
                        oj.red=0;
                        oj.green=0;
                        oj.orange=0; 
                    }
                    else
                    {
                            var obj=await culvertIssueMain.findOne({_id:val._id,date:df},{}).exec();
                            console.log(obj);
                            if(obj.type=="red" && obj.solved_color=="")
                            {
                                oj.red=1;
                            }
                            if(obj.type=="red" && obj.solved_color!=null && obj.solved_color!="")
                            {
                                oj.green=1;
                                console.log("green");
                            }
                            else if(obj.type=="green")
                            {
                                oj.green=1;
                            }
                            else if(val.type=="orange")
                            {
                                oj.orange=1;
                            }
                    }
                    culvert_obj["data"].push(oj);
                    //culvert_obj["data"].sort();
                    await culvert_obj["data"].sort(compare);
                    }));
                    finaldata.push(culvert_obj); 
                }));
            }
            console.log(finaldata);
                return finaldata;
        break;

    }
  }

  function getDateRange(startDate, endDate, addFn, interval) {

    addFn = addFn || Date.prototype.addDays;
    interval = interval || 1;
    var dates = [];
    var date  = new Date(startDate);
    while (date  <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;

   }

   function compare( a, b ) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }

   
exports.Culvertscan_cronjob = async (req, res) => 
{
  const Culvert_rows = await Culvert.find({status:"Active"}).exec();
  const docs = [];
  let current_datetime = new Date();
  console.log(Culvert_rows);
// let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate();
    let s = new String(current_datetime.getDate());
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
    Culvert_rows.forEach(async function(item)
   {
    var countDocuments=await culvertIssueMain.findOne({culvert_id:item._id}).countDocuments();
if(countDocuments>0)
{
            var culvertd=await culvertIssueMain.findOne({culvert_id:item._id}).sort({_id:-1});
            var type=""; 
            var isse_type_id="";
            var issue_name="";
            var issue_depth="";
            var status="";
            var image="";
            console.log(culvertd);
        ///  break;
            if(culvertd.type == "red" && culvertd.solved_color=="")
            {
                type='red';
                isse_type_id=culvertd.isse_type_id;
            //  solved_color=culvert.solved_color;
                issue_name=culvertd.issue_name;
                issue_depth=culvertd.issue_depth;
                image=culvertd.image;
                status=culvertd.status;
                image=culvertd.image;
            }
            else
            {
                type='';
                isse_type_id=null;
                issue_name="";
                issue_depth="";
                image="";
                status="";
                image="";
            }
        }
        else
        {
            type='';
            isse_type_id=null;
            issue_name="";
            issue_depth="";
            image="";
            status="";
            image="";
        }
    console.log(formatted_date);
    console.log("formatted_date");

    var docs={    
    culvertname:item.name, 
    unique_no:item.unique_no,
    issue_name:issue_name,    
    date:formatted_date,
    culvert_id:item._id,
    issue_depth:issue_depth,
    type:type,
    isse_type_id:isse_type_id,
    culvertType:item.type,
    image:image,
    time:'',
    zone_id:item.zone_id,
    circle_id:item.circle_id, 
    ward_id:item.ward_id,
    landmark_id:item.landmark_id,
    area_id:item.area_id, 
    area:item.area,
    zone:item.zone,
    circle:item.circle,
    ward:item.ward,
    landmark:item.landmark,
    status: "",
    user_id:null,
    log_date_created: "",
    created_by:null,
    log_date_modified:"",
    solved_date:"",
    solved_time:"",
    solved_color:"",
    solved_image:"",
    solved_date:"",
    modified_by:null
 };
 const result=await  culvertIssueMain(docs).save();
    });

    responseObject = { success: true, login: true, message:result.insertedCount+' Saved successfully' }
    res.status(200).json(responseObject);
}





