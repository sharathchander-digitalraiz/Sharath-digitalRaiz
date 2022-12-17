const importdata= require("../model/importdata");
exports.createimportdata = (req, res) => 
{
  const { zone,circle,ward_no,ward_name,sfa_name,sfa_mobile_number,vechile_registration_number,vechile_type,driver_name,
    driver_number,vechile_allocated_location,transfer_attached,remarks,log_date_created,created_by,qr_code_view,unique_no,
    zone_id,circle_id,ward_id,vechiletype,vechile_type_id,tansfer_station_id,type,landmark_id,log_date_modified,modified_by} = req.body;
 
  const list = new importdata({
    zone:zone,
    circle: circle,
    ward_no: ward_no,
    ward_name:ward_name,   
    sfa_name: sfa_name,
    sfa_mobile_number:sfa_mobile_number,
    vechile_registration_number:vechile_registration_number,
    vechile_type:vechile_type,
    driver_name:driver_name,
    driver_number:driver_number,
    vechile_allocated_location:vechile_allocated_location,
    transfer_attached:transfer_attached,
    remarks:remarks,
    log_date_created:log_date_created, 
    created_by:created_by,
    qr_code_view:qr_code_view,
    unique_no:unique_no,
    zone_id:zone_id,
    circle_id:circle_id,
    ward_id:ward_id,
    vechiletype:vechiletype,
    vechile_type_id:vechile_type_id,
    tansfer_station_id:tansfer_station_id,
    type:type,
    landmark_id:landmark_id,
    log_date_modified:log_date_modified,
    modified_by:modified_by
});
list.save((error, list) =>
{
    if (error) return res.status(400).json({ error });
    if(list) 
    {
      res.status(200).json({list});
    } 
  });
};