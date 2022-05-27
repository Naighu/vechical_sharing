var jwt = require('jsonwebtoken');
const redis = require('../../../services/redis_db');
require('dotenv').config();

function generatejwttoken (userdata) {
    return jwt.sign({ data: userdata},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '24h' })
}

function verifyAccessToken(req, res, next) {

    if (redis.IsReady) {
  
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null) return res.status(403).json({ "code": 403, "message": "Access Token reuired" })
  
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          console.log(user);
        if (err != null) return res.status(401).json({ "code": 401, "message": "Invalid Token" + err })
        next()
        //res.status(200).json({code:200,message:"User validated successfully" });
      })
  
    } else {
      console.log("Redis not connected error");
      return res.status(500).json({ "code": 500, "message": "Redis not connected"});
    }
  }



module.exports= {generatejwttoken,verifyAccessToken};