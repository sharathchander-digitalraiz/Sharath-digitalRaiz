const culvert = require("../../model/culvert");
const culvert_issues=require("../../model/culvertissue");
const complex_building = require("../../model/complex_building");
const communityhall = require('../../model/communityhall'); 
const streetvendors = require('../../model/streetvendor'); 
const parking = require('../../model/parking'); 
const residential_house = require('../../model/residential_house'); 
const open_place = require('../../model/openplace');
const man_hole_tree_busstops = require('../../model/man_hole_tree_busstop'); 
const temples = require('../../model/temple'); 
const toilets = require('../../model/toilets'); 
const unique_nos = require('../../model/unique_nos'); 
const user = require("../../model/users");
const useraccess = require("../../model/useraccess");
const vehicle = require("../../model/vehicles");
const vehicle_attandance=require("../../model/vehicles_attandance");
const absent_vehicles_reason=require("../../model/absentreason");
const TempleOperations=require("../../model/temple_operations");

exports.operations_scan = async(req, res) => {
  
  const { user_id, geo_id, latitude, longitude } = req.body;
  const vehicle_rows = await vehicle.findOne({ unique_no: geo_id }).countDocuments();
  const unique_no_row = await unique_nos.findOne({ unique_no:geo_id }).countDocuments(); 
  if (vehicle_rows != "0")
  {

      let user_data=await user.findOne({_id:user_id},{department_name:1}).exec();
      if(user_data.department_name == 'Transfer Station Manager'){
        return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:{"operation":"transfer_station","operation_code":"TSM"}});
      }else{
        return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
        data:{"operation":"vehicle","operation_code":"VEH"}});
      } 
   
  }else if(unique_no_row != 0){
       
    
        var result = await unique_nos.findOne({ unique_no:geo_id });
        console.log(result.type_db);
        if(result.type_db == 'comercial_buildings')
        {
          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"comercial_buildings","operation_code":"COMMERCIAL1"}});

        }
        else if(result.type_db == 'comercial_flats'){ 

          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"comercial_flats","operation_code":"FLATS1"}});

        }else if(result.type_db == 'communityhalls'){ 

          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"communityhalls","operation_code":"HALL1"}});

        }else if(result.type_db == 'streetvendors')
        {
          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"streetvendors","operation_code":"STREET1"}});

        }else if(result.type_db == 'parkings')
        {
          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"parkings","operation_code":"PAR1"}});

        }else if(result.type_db == 'residential_houses')
        {
          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"residential_houses","operation_code":"RES1"}});

        }else if(result.type_db == 'open_places')
        {
          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"open_places","operation_code":"OPEN1"}});

        }else if(result.type_db == 'man_hole_tree_busstops')
        {
          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"manhole","operation_code":"MANHOLE1"}});

        }else if(result.type_db == 'temples')
        {
          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:{"operation":"temple","operation_code":"TEM1"}});

        }else if(result.type_db == 'toilets')
        {
       
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:{"operation":"toilet","operation_code":"TOI1"}});
        }
  }
  else {
    const users_list = await user.findOne({ _id: user_id }).exec(); 
      const culvert_list_rows = await culvert.findOne({ unique_no: geo_id }).countDocuments();
      if (culvert_list_rows!= "0") 
      {
        return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
        data:{"operation":"Culvert","operation_code":"CUL123"}});

      }
      else {
        return res.status(200).json({ success: true, login: true, message: 'No results found', data: [] });
      }
  }

}