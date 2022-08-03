const mongoose = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;

const routeSchema = new mongoose.Schema({
    country_crossed: Boolean,
    distance: Number,
    duration: Number,
    uuid: String,
    _id: false,
    geometry: {
      type:{
        type:"String",
        enum:['Polygon'],
        required:true
      },
      coordinates:[{
        type:[Number, Number],
        required:true
      }]
    }
})



const driverSchema = new mongoose.Schema({
    userid: {
        type:ObjectId,
        ref: 'Users'
    },
    route: routeSchema,
    start_time: Date,
    mode: {
        type:"String",
        enum:["gurantee","non-gurantee"],
    },
    vechicle: {
      type: ObjectId,
      ref: 'Vehicles'
    },
    sections: {
        type: Map,
    },

    created_at: {
        type: Date,
        default: Date.now
      },
    jourey_started:{
        type: Boolean,
        default: false
    },
    reqPending:[],
    reqAccepted:[]
  })



module.exports = mongoose.model('Driver_journey', driverSchema);