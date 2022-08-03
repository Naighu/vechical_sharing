const express = require('express');
const router = express.Router();
const resp = require('./data/response')
const vehicles = require('../../models/vehicles')
const { validateProfileUpdate,validateVehicleUpdate } = require('./middlewares/validator');
const { findById } = require('../../models/vehicles');



router.get("/",(req,res)=> {
   
    res.status(201).json({code:200,message:"Profile fetched successfully",result:req.user})
})

router.put("/",validateProfileUpdate,(req,res)=> {
    
    for (let [key, value] of Object.entries(req.body)) {
        req.user[key] = value;
    }
    req.user.save().then(data => {
        res.status(201).json({code:200,message:"Profile updated successfully"});
    }).catch(err => {
        res.status(200).json({code:500,message:"Something went wrong "+err});
    })
})

router.post("/vehicle-details",validateVehicleUpdate, (req,res) =>{
    const reg_num  = req.body.registration_num
    const veh_type = req.body.vehicle_type
    const veh_model = req.body.vehicle_model
    const veh_seat = req.body.vehicle_seat

    user_id = req.user._id
    //console.log(vehicles.user_id)
    const vehicle = new vehicles({registration_num:reg_num, vehicle_type:veh_type, vehicle_model:veh_model, vehicle_seat: veh_seat, user_id:user_id})
    
    vehicle.save().then(data => {
        res.status(201).json({code:200, message:"Vehicle Added Successfully"})
    }).catch(err => {
        res.status(200).json({code:500, message:"Vehicle Number Already Exist"})
    })
    //console.log(req.user.vehicle_ids)
    req.user.vehicle_ids.push(vehicle._id)
    req.user.save().then (data => {
         res.status(201).json({code:200, message:"vehicle id appended"})
     }).catch( err => {
         res.status(200).json({code:500, message:"vehicle id not appended" + err})
     })
})

 router.get("/vehicle-details", async (req,res) => {
        veh_id = req.user.vehicle_ids
        console.log(veh_id)
        const veh = []
        for( let id=0; id < veh_id.length; id++){
            veh[id] = await vehicles.findById(veh_id[id])
            //allveh[id].push(veh)
        }
        res.status(201).json({code:200, message:"Vehicles Fetched Successfully",result: veh})
 })


module.exports = router