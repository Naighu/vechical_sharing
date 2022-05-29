const mongoose = require('mongoose');
const validator = require('validator');

const { ObjectId } = mongoose.Schema.Types;


const statSchema = new mongoose.Schema({
  score: {
    type:Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  }
})


const userSchema = new mongoose.Schema({

  phone: {
    type: String,
    required: [true, 'is required'],
    unique: [true, 'Phone already in use'],
    trim: true
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 150,
    validate: {
      validator: function (val) {
        let result = val.replace(/ /g, '');
        return validator.isAlpha(result);
      },
      message: 'Name should contain only alphabets with or without spaces'
    },
    trim: true
  },
  device: {
   
    platform: {
      type: String,
      enum: ['web','android','ios'],
      lowercase: true,
      
    },
    
    fcm: String,
    app_version: String,
   
  },
stat: statSchema,
 address: {
  type:String,
 },
 pincode: {
  type:Number,
  minlength: 6,
  maxlength:6
 },

 document_verified :{
   type:Boolean,
   default:false
 },
  gender: {
    type: String,
    enum: ['male','female','others'],
    lowercase: true
  },

 profile_image: {
    type: String,
    
  },
 
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }

  
})


// userSchema.pre('save', async function save(next) {
//   this.increment();
//   if(!this.username){
//     this.username = ID()
//   }
//   this.updated_at = new Date;
//   return next();
// });

//userSchema.index({location:"2dsphere"});

module.exports = mongoose.model('Users', userSchema)