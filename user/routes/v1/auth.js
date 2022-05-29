
const express = require('express');
const router = express.Router();
const mongoose = require('../../services/mongo_db');
const redis = require('../../services/redis_db');
const user = require('../../models/user');
const {generateOTP} = require('../../helper/otp_generator')
const {createUser} = require('../../helper/create_user')
const resp = require('./data/response')

const { validateRequestOTP } = require('./middlewares/validator');
const {generatejwttoken,verifyAccessToken} = require("./middlewares/token");


//Base URL = http://localhost:PORT/v1/auth/

router.get("/", verifyAccessToken,(req,res) => {

    return res.status(200).json({ "response_code": 200, "message": "Hello User!", "response": { hello : "hi"} });
})

router.post("/generate-otp",validateRequestOTP, async (req,res)  => {
    let limit = await redis.get(`${req.body.phone}-limit`);

    if(limit > 3) {
        res.status(403).json({code: 429,message: resp[429]})
        return
    }
    let user1 = await user.findOne({"phone": req.body.phone});
    
    

    if(user1 == null)
    {
        createUser(req)
        .then(data => {
           // const otp = otpGenerator.generate(4, { digits:true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            const otp =  generateOTP(4);
            
            redis.set(`${data.phone}-${otp}`,otp,'ex',180);
            
            res.status(201).json({code: 200,message: "OTP Generated Successfully", result: {otp: otp}})
        })
        .catch(err => {
            console.log(err)
            res.status(200).json({code: 500,message: resp[500]})
        })
    }else{
 
        for(let [key,value ] of Object.entries(req.body.device)) {
            user1.device[key] = value;
        }
        user1.then(_ => {
            const otp =  generateOTP(4);
            redis.set(`${req.body.phone}-${otp}`,otp,'ex',180);
            
            res.status(201).json({code: 200,message: "OTP Generated Successfully", result: {otp: otp}})
            redis.set(`${req.body.phone}-limit`,limit+1,'ex',300);
        }).catch(err => {
            res.status(200).json({code: 500,message:resp[500]})
        })
        
    }

    
})

router.post("/verify-user",(req,res) =>  {
    if(req.body.phone == null){
        res.status(200).json({code: 200,message: "phone field required"});
        return
    }else if(req.body.otp == null){
        res.status(200).json({code: 200,message: "OTP field required"});
        return
    }
    
    redis.get(`${req.body.phone}-${req.body.otp}`,function(err,val) {
        
         if(err == null && req.body.otp === val){
            let access_token = generatejwttoken(req.body.phone,'24h')
          
            redis.set(req.body.phone,access_token,'ex',86400).then(_ => {
                user.findOne({"phone": req.body.phone}).then(user1 => {

                    res.status(201).json({code:200,message:"OTP verified successfully",result: {access_token: access_token,user: user1}});
                 }).catch(err => {
                    res.status(200).json({code:500,message: resp[500]});
                 })
            }).catch(err => {
                res.status(200).json({code:500,message: resp[500]});
             })
            
            redis.del(`${req.body.phone}-${val}`);
        }else{
            res.status(200).json({code:401,message:"Invalid OTP"});
        }
    })
   
})

router.get("/logout",verifyAccessToken, (req,res) =>  {
    redis.del(req.user.phone).then(_ => {
        res.status(201).json({code:200,message: "Logged out sucessfully"});
    }).catch(err => {
        res.status(200).json({code:500,message:resp[500]});
    })
   
})


module.exports = router