var jwt = require('jsonwebtoken');
const redis = require('../../../services/redis_db');
const resp = require('../data/response');
const user = require('../../../models/user');

require('dotenv').config();

function generatejwttoken (userdata,expire) {
    return jwt.sign({ data: userdata},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: expire })
}

function verifyAccessToken(req, res, next) {

    if (redis.IsReady) {
  
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null) return res.status(403).json({ "code": 403, "message": "Access Token reuired" })
  
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user1) => {
       
        if (err != null) return res.status(401).json({ "code": 401, "message": "Invalid Token" + err })
        //user.data is the phone number
        redis.get(user1.data).then(data => {
           if(data != null){

            user.findOne({"phone": user1.data}).then(user2 => {
              if(user2 != null){
                req.user = user2;
                next();
              }
              else{
                res.status(200).json({ "code": 500, "message":resp[500]});
              }
             
             
            }).catch(err => {
              console.log(err);
            })
            
           }else{
             console.log("No token on redis");
            res.status(401).json({ "code": 401, "message":resp[401]});
           }
         })
      
      })
  
    } else {
     
      return res.status(500).json({ "code": 500, "message": "Redis not connected"});
    }
  }



module.exports= {generatejwttoken,verifyAccessToken};