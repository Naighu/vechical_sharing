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
module.exports = { validateProfileUpdate,validateRequestOTP }