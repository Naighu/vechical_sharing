const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;

const vehicleSchema = new mongoose.Schema({
    registration_num: {
        type:'String',
        required:true,
        unique:true, 
    },

    vehicle_type: {
        type:'String',
        enum:['car', 'bike', 'scooter'],
        lowercase:true,
        //required:true,
    },

    vehicle_model: {
        type:'String',
        //required:true,
    },

    vehicle_seat: {
        type:'number',
        //required:true
    },
    user_id: {
        type:ObjectId,
        ref:'Users'
    },
})

module.exports = mongoose.model('Vehicles', vehicleSchema)