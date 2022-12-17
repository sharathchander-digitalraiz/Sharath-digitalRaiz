const Culvert = require('../../model/culvert'); 
const Culvert_issue = require('../../model/culvertissue'); 
const Culvert_solved = require('../../model/culvertsolved'); 
const Useraccess = require('../../model/useraccess'); 
const Circles = require('../../model/circles'); 
const User    = require('../../model/users'); 
const Department = require('../../model/department'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

exports.culvert_issue_report = async(req,res)=>{
    const { user_id,tenent_id } = req.body;
    let acc_dep_data = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
    // console.log(acc_dep_data); 
    let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
    if(role_data.name == 'Admin'){
            
            let newobject = {}; 
            if(req.body.tenent_id != '' && req.body.tenent_id != undefined){
                newobject['tenent_id'] = ObjectId(req.body.tenent_id); 
            }
          
            const culvert_data = await Culvert.find(newobject,{_id:1,zone:1,circle:1,ward:1,area:1,landmark:1 }).exec(); 
            // console.log(culvert_data);

            async function processculvert_issue(data){
                let finaldata = []; 
               await Promise.all(culvert_data.map( async(val)=>{
                   // console.log(val); 
                    let culvert_obj = {zone:val.zone,circle:val.circle,ward:val.ward,area:val.area,landmark:val.landmark}; 
                    
                    const count_issue  =   await Culvert_issue.find({culvert_id:val._id}).countDocuments();
                    if(count_issue > 0){
                        const issue_data =  await Culvert_issue.find({culvert_id:val._id},{_id:1,log_date_created:1,image:1,
                            issue_depth:1,status:1}).exec();
                      //  console.log(issue_data); 
                        culvert_obj['visit_date'] = issue_data[0].log_date_created;
                        culvert_obj['visit_image'] = issue_data[0].image;
                        culvert_obj['reported_depth'] = issue_data[0].issue_depth; 
                        culvert_obj['reported_status'] = issue_data[0].status;
                        const count_solved =  await Culvert_solved.find({culvert_id:val._id,culvert_issue_id:issue_data[0]._id}).countDocuments();
                        if(count_solved > 0){ 
                            const count_solved =  await Culvert_solved.find({culvert_id:val._id,culvert_issue_id:issue_data[0]._id} ,{date:1,image:1,status:1,user_id:1}).exec();
                            //console.log(count_solved); 
                            culvert_obj['resolved_date']   = count_solved[0].date;
                            culvert_obj['resolved_image']  = count_solved[0].image;
                            culvert_obj['resolved_status'] = count_solved[0].status;
                            culvert_obj['resolved_user']   = count_solved[0].user_id;
                        }else{
                            culvert_obj['resolved_date']   = '-';
                            culvert_obj['resolved_image']  = '-'; 
                            culvert_obj['resolved_status'] = '-';
                            culvert_obj['resolved_user']   = '-';
                        }
                    }else{
                        culvert_obj['visit_date']      = '-';   
                        culvert_obj['visit_image']     = '-';    
                        culvert_obj['reported_depth']  = '-'; 
                        culvert_obj['reported_status'] = '-'; 
                    }
                   
                    finaldata.push(culvert_obj); 
               }));
                return finaldata; 
            }
            
            let userToken = processculvert_issue(1);
 
            userToken.then(function(result) {
                res.status(200).send({login:true,status:true,result:result}) 
            }); 
    }else{
        // console.log('not admin'); 
        const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec()
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
            const culvert_data = await Culvert.find(newobject,{_id:1,zone:1,circle:1,ward:1,area:1,landmark:1 }).exec(); 
            
            async function processculvert_issue(data){
                let finaldata = []; 
               await Promise.all(culvert_data.map( async(val)=>{
                   // console.log(val); 
                    let culvert_obj = {zone:val.zone,circle:val.circle,ward:val.ward,area:val.area,landmark:val.landmark}; 
                    
                    const count_issue  =   await Culvert_issue.find({culvert_id:val._id}).countDocuments();
                    if(count_issue > 0){
                        const issue_data =  await Culvert_issue.find({culvert_id:val._id},{_id:1,log_date_created:1,image:1,
                            issue_depth:1,status:1}).exec();
                      //  console.log(issue_data); 
                        culvert_obj['visit_date'] = issue_data[0].log_date_created;
                        culvert_obj['visit_image'] = issue_data[0].image;
                        culvert_obj['reported_depth'] = issue_data[0].issue_depth; 
                        culvert_obj['reported_status'] = issue_data[0].status;
                        const count_solved =  await Culvert_solved.find({culvert_id:val._id,culvert_issue_id:issue_data[0]._id}).countDocuments();
                        if(count_solved > 0){ 
                            const count_solved =  await Culvert_solved.find({culvert_id:val._id,culvert_issue_id:issue_data[0]._id} ,{date:1,image:1,status:1,user_id:1}).exec();
                            //console.log(count_solved); 
                            culvert_obj['resolved_date']   = count_solved[0].date;
                            culvert_obj['resolved_image']  = count_solved[0].image;
                            culvert_obj['resolved_status'] = count_solved[0].status;
                            culvert_obj['resolved_user']   = count_solved[0].user_id;
                        }else{
                            culvert_obj['resolved_date']   = '-';
                            culvert_obj['resolved_image']  = '-'; 
                            culvert_obj['resolved_status'] = '-';
                            culvert_obj['resolved_user']   = '-';
                        }
                    }else{
                        culvert_obj['visit_date']      = '-';   
                        culvert_obj['visit_image']     = '-';    
                        culvert_obj['reported_depth']  = '-'; 
                        culvert_obj['reported_status'] = '-'; 
                    }
                   
                    finaldata.push(culvert_obj); 
               }));
                return finaldata; 
            }
            
            let userToken = processculvert_issue(1);
 
            userToken.then(function(result) {
                res.status(200).send({login:true,status:true,result:result}) 
            });
    }
}   



exports.culvert_issue_report_search = async(req,res)=>{  
        const { user_id,zone_id,circle_id } = req.body;  
        if(zone_id == ''){
            return res.status(400).send({login:true,success:false,message:'Please select Zone'})
        }
        
        let newobject ={};   
        if(zone_id != '' && zone_id != undefined){
            newobject['zone_id'] = ObjectId(zone_id); 
        }
        if(circle_id != '' && circle_id != undefined){
            newobject['circle_id'] = ObjectId(circle_id); 
        }   
        
        const culvert_data = await Culvert.find(newobject,{_id:1,zone:1,circle:1,ward:1,area:1,landmark:1 }).exec(); 
            // console.log(culvert_data);

            async function processculvert_issue(data){
                let finaldata = [];  
               await Promise.all(culvert_data.map( async(val)=>{ 
                   // console.log(val); 
                    let culvert_obj = {zone:val.zone,circle:val.circle,ward:val.ward,area:val.area,landmark:val.landmark}; 
                    
                    const count_issue  =   await Culvert_issue.find({culvert_id:val._id}).countDocuments();
                    if(count_issue > 0){ 
                        const issue_data =  await Culvert_issue.find({culvert_id:val._id},{_id:1,log_date_created:1,image:1,
                            issue_depth:1,status:1}).exec();
                      //  console.log(issue_data); 
                        culvert_obj['visit_date'] = issue_data[0].log_date_created;
                        culvert_obj['visit_image'] = issue_data[0].image;
                        culvert_obj['reported_depth'] = issue_data[0].issue_depth; 
                        culvert_obj['reported_status'] = issue_data[0].status;
                        const count_solved =  await Culvert_solved.find({culvert_id:val._id,culvert_issue_id:issue_data[0]._id}).countDocuments();
                        if(count_solved > 0){ 
                            const count_solved =  await Culvert_solved.find({culvert_id:val._id,culvert_issue_id:issue_data[0]._id} ,{date:1,image:1,status:1,user_id:1}).exec();
                            //console.log(count_solved); 
                            culvert_obj['resolved_date']   = count_solved[0].date;
                            culvert_obj['resolved_image']  = count_solved[0].image;
                            culvert_obj['resolved_status'] = count_solved[0].status;
                            culvert_obj['resolved_user']   = count_solved[0].user_id;
                        }else{
                            culvert_obj['resolved_date']   = '-';
                            culvert_obj['resolved_image']  = '-'; 
                            culvert_obj['resolved_status'] = '-';
                            culvert_obj['resolved_user']   = '-';
                        }
                    }else{
                        culvert_obj['visit_date']      = '-';   
                        culvert_obj['visit_image']     = '-';    
                        culvert_obj['reported_depth']  = '-'; 
                        culvert_obj['reported_status'] = '-'; 
                    }
                   
                    finaldata.push(culvert_obj); 
               }));
                return finaldata; 
            }
            
            let userToken = processculvert_issue(1);
 
            userToken.then(function(result) {
                res.status(200).send({login:true,status:true,result:result}) 
            }); 
}