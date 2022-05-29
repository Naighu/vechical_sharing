const express = require('express');
const router = express.Router();
const resp = require('./data/response')
const { validateProfileUpdate } = require('./middlewares/validator');



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




module.exports = router