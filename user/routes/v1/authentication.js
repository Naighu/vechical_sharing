
const express = require('express');
const router = express.Router();
const mongoose = require('../../services/mongo_db');
const redis = require('../../services/redis_db');
const user = require('../../models/user');
const otpGenerator = require('otp-generator')
const {generatejwttoken,verifyAccessToken} = require("./middlewares/token");

router.get("/", verifyAccessToken,(req,res) => {

    return res.status(200).json({ "response_code": 200, "message": "Hello User!", "response": { hello : "hi"} });
})
router.post("/generate-otp",async (req,res)  => {
    
    let user1 = await user.find({"phone": req.body.phone});
    if(user1.length == 0)
    {
        let test_user = new user()
        test_user.phone = req.body.phone
        test_user.save()
        .then(data => {
            const otp = otpGenerator.generate(4, { digits:true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            redis.set(`${data.phone}-${otp}`,otp,'ex',180);
        
            res.status(200).json({code: 200,message: "OTP Generated Successfully", result: {otp: otp}})
        })
        .catch(err => {
            console.log(err)
            res.json({code: 500,message: `${err}`})
        })
    }else{
        const otp = otpGenerator.generate(4, { digits:true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        redis.set(`${req.body.phone}-${otp}`,otp,'ex',180);
        
        res.status(200).json({code: 200,message: "OTP Generated Successfully", result: {otp: otp}})
    }
})

router.post("/verify-user",(req,res) => {
    redis.get(`${req.body.phone}-${req.body.otp}`,function(err,val) {
        console.log(val);
        if(err != null)
        {
            res.status(401).json({code:401,message:`OTP is not generated ${err}`});
        }else if(req.body.otp === val){
            let access_token = generatejwttoken(req.body.phone)
             user.findOne({"phone": req.body.phone}).then(user1 => {
                res.status(200).json({code:200,message:"OTP verified successfully",result: {access_token: access_token,user: user1}});
             }).catch(err => {
                res.status(401).json({code:401,message:"could not fetch user details"});
             })
            
           

            
            redis.del(req.body.phone);
        }else{
            res.status(401).json({code:401,message:"Invalid OTP"});
        }
    })
    // user.findOne({ phone: req.phone })
    // .then(data => {

    // })
    // .catch(err => {

    // })
    //res.json({success:true})
})


module.exports = router