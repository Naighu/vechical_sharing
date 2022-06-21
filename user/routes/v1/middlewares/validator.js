const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv({verbose: true})
const resp = require('../data/response')
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
            required: ["platform", "fcm","app_version"],
        }
    
    },
    required: ["phone","device"]
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


module.exports = { validateProfileUpdate,validateRequestOTP,validateWalletUpdate,validateVehicleUpdate }