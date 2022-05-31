const mongoose = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;

const routeSchema = new mongoose.Schema({
    country_crossed: Boolean,
    distance: Number,
    duration: Number,
    uuid: String,
    _id: false,
    geometry: Map
})

const vechicleSchema = new mongoose.Schema({
  registration_number: String,
  model: String,
  total_seat:Number,
  _id: false,
  available_seat:Number
})

const journeySchema = new mongoose.Schema({
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
    vechicle:vechicleSchema,
    sections: {
        type: Array,
        lowercase: true,
        
    },
    created_at: {
        type: Date,
        default: Date.now
      },
    jourey_started:{
        type: Boolean,
        default: false
    }
  })



module.exports = mongoose.model('Journey', journeySchema);