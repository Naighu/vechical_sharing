const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv({verbose: true})
const resp = require('../data/response')
const vehicles = require('../../../models/vehicles');
const Journey = require('../../../models/journey')
const seekerJourney = require('../../../models/seeker_journey')
addFormats(ajv)

const schemaRequestOTP = {
    type:"object",
    properties: {
        phone: { type: "string", maxLength: 10, minLength: 10 },
        device: {
            type: "object", 
            properties: {
                platform: { enum: ['web','android','ios'] },
                fcm: {type: "string"},
                app_version: {type: "string"}
            } ,
            //required: ["platform", "fcm","app_version"],
        }
    
    },
    required: ["phone"]
}
const requestOTP = ajv.compile(schemaRequestOTP)

function validateRequestOTP(req, res, next) {
    const valid = requestOTP(req.body)
    if (!valid) {
        return res.status(200).json({ "code": 400, "message": requestOTP.errors[0].message})
    } else {
        next();
    }
}

const schemaUpdateValidate = {
    type: "object",
    properties: {
      name: { type: "string", maxLength: 150, minLength: 2 },
      dob: { type: "string", format: "date" },
      address: {type:"string", maxLength: 500, minLength: 10},
      pincode: {type:"string",maxLength:6,minLength : 6},
      gender: { enum : ['male','female','others'] },
    },
    required: ["name", "dob","address","gender","pincode"],
    additionalProperties: false
  }
  
  const updateValidate = ajv.compile(schemaUpdateValidate)

function validateProfileUpdate(req, res, next) {
    const valid = updateValidate(req.body)
    if (!valid) {
        return res.status(200).json({ "code": 400, "message": updateValidate.errors[0].message})
    } else {
       
       
      
        next();
    }
}

const schemaWalletValidate = {
    type: "object",
    properties: {
      amount: { type: "number"},
      transaction_type: {
        enum:["withdraw","deposit"]
      }, 
    },
    required: ["amount", "transaction_type"],
    additionalProperties: false
  }
  
  const walletValidate = ajv.compile(schemaWalletValidate)

function validateWalletUpdate(req, res, next) {
    const valid = walletValidate(req.body)
    if (!valid) {
        return res.status(200).json({ "code": 400, "message": walletValidate.errors[0].message})
    } else {
       if(req.body.amount <= 0)
       {
           return res.status(200).json({ "code": 400, "message": "Amount should be greater than 0"})
       }
       
      
        next();
    }
}

const schemaVehicleValidate = {
    type:"object",
    properties: {
        registration_num : { type:"string" },
        vehicle_type : { enum: ['car', 'bike', 'scooter'] },
        vehicle_model : { type:"string" },
        vehicle_seat : { type:"number"},
    },
    required: ["registration_num", "vehicle_type", "vehicle_model", "vehicle_seat"],
    additionalProperties: false
} 

const vehicleValidate = ajv.compile(schemaVehicleValidate)

function validateVehicleUpdate(req,res,next) {
    const valid = vehicleValidate(req.body)
    if(!valid) {
        return res.status(200).json({ "code": 400, "message": "Field is Required"})
    }
    else{
        next()
    }
}

const schemaJourney = {
    type:"object",
   // additionalProperties: false,
    properties: {
       
        start_time: {type:"string"},
        mode: {
            type:"string",
            enum:["gurantee","non-gurantee"],
        },

        
        route: {
            //additionalProperties: false,
            type:"object",
            properties: {
                country_crossed: {type:"boolean"},
                distance: {type: "number"},
                duration: {type: "number"},
                uuid: {type: "string"},
                geometry: {
                    type:"object",
                   // additionalProperties: false,
                    // properties: {
                    //     coordinates: {type: "string"},
                       
                    // }
                }
            },
            required: ["country_crossed","distance","duration","uuid","geometry"]
        }
        
    
    },
    required: ["start_time","mode","route"]
}
const journey = ajv.compile(schemaJourney)

function validateJourney(req, res, next) {
    const valid = journey(req.body)
    if (!valid) {
        return res.status(200).json({ "code": 400, "message": journey.errors[0].message})
    } else if(req.body.route.country_crossed) {//30km
        return res.status(200).json({"code": 400,"message": "Select route within India"})
    }else if(req.body.route.distance > 30000) {//30km
       return res.status(200).json({"code": 400,"message": "Toal distance should be less than 30 km"})
    }
    
    else{
        let datetime = new Date();
        startDate = new Date(req.body.start_time);
        if(datetime - startDate > 0 ){
            return res.status(200).json({"code": 400,"message": "Date should not be past"})
        }
        datetime.setMinutes(datetime.getMinutes() + 60)
        
        
        if(datetime - startDate < 0 ){
            return res.status(200).json({"code": 400,"message": "Journey can be set with in 1 hour"})
        }
        
        //Driver cannot set morethan 2 journey
        //console.log(req.user._id)
        Journey.findOne({userid : req.user._id}).then(data => {
            //console.log(data)
            if(data == null){
                vehicles.findById({"_id": req.body.vechicle}).then(data => { 
                    
                    if(data != null && data.user_id.toString() == req.user._id.toString()){
                        next()
                     }else{
                        return res.status(200).json({"code": 400,"message": "Vechicle Does nt exist"})
                    }
                }).catch(err => {
                    return res.status(200).json({"code": 500,"message": "Something went wrong","error":err})
                })
            }else{
                return res.status(200).json({"code": 400,"message": "Already a journey is set.Please finish the journey and start new One"})
            }
        })

        
      
    }
}

const schemaSeekerJourney = {
    type:"object",
   // additionalProperties: false,
    properties: {
       
        start_time: {type:"string"},
        mode: {
            type:"string",
            enum:["gurantee","non-gurantee"],
        },

        
        route: {
            //additionalProperties: false,
            type:"object",
            properties: {
                country_crossed: {type:"boolean"},
                distance: {type: "number"},
                duration: {type: "number"},
                uuid: {type: "string"},
                geometry: {
                    type:"object",
                   // additionalProperties: false,
                    // properties: {
                    //     coordinates: {type: "string"},
                       
                    // }
                }
            },
            required: ["country_crossed","distance","duration","uuid","geometry"]
        }
        
    
    },
    required: ["start_time","mode","route"]
}
const seekerjourney = ajv.compile(schemaSeekerJourney)

function validateSeekerJourney(req, res, next) {
    const valid = seekerjourney(req.body)
    if (!valid) {
        return res.status(200).json({ "code": 400, "message": seekerjourney.errors[0].message})
    } else if(req.body.route.country_crossed) {//30km
        return res.status(200).json({"code": 400,"message": "Select route within India"})
    }else if(req.body.route.distance > 30000) {//30km
       return res.status(200).json({"code": 400,"message": "Toal distance should be less than 30 km"})
    }
    
    else{
        let datetime = new Date();
        startDate = new Date(req.body.start_time);
        if(datetime - startDate > 0 ){
            return res.status(200).json({"code": 400,"message": "Date should not be past"})
        }
        datetime.setMinutes(datetime.getMinutes() + 60)
        
        
        if(datetime - startDate < 0 ){
            return res.status(200).json({"code": 400,"message": "Journey can be set with in 1 hour"})
        }
        
        //Driver cannot set morethan 2 journey
        seekerJourney.findOne({user_id : req.user._id}).then(data => {
            
            if(data == null){
                next()
            //     vehicles.findById({"_id": req.body.vechicle}).then(data => {
                    
            //         if(data != null && data.user_id.toString() == req.user._id.toString()){
            //             next()
            //          }else{
            //             return res.status(200).json({"code": 400,"message": "Vechicle Does nt exist"})
            //         }
            //     }).catch(err => {
            //         return res.status(200).json({"code": 500,"message": "Something went wrong","error":err})
            //     })
            }
            else{
                return res.status(200).json({"code": 400,"message": "Already a journey is set.Please finish the journey and start new One"})
            }
        })

        
      
    }
}



module.exports = { validateProfileUpdate,validateRequestOTP,validateWalletUpdate,validateVehicleUpdate, validateJourney, validateSeekerJourney }