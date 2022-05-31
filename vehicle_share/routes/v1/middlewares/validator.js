const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv({verbose: true})
const resp = require('../data/response')
const user = require('../../../models/user');
addFormats(ajv)

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
        
        console.log(datetime - startDate);
        if(datetime - startDate < 0 ){
            return res.status(200).json({"code": 400,"message": "Journey can be set with in 1 hour"})
        }
        
        //Driver cannot set morethan 2 journey
        user.find({user_id : req.user._id}).then(data => {
            if(data == null){
                next();
            }else{
                return res.status(200).json({"code": 400,"message": "Already a journey is set.Please finish the journey and start new One"})
            }
        })
      
    }
}




module.exports = { validateJourney }