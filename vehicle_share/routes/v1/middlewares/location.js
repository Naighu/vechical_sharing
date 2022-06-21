var geoip = require('geoip-lite');

function validateLocation(req,res,next)  {
    let ip = req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress;
    var geo = geoip.lookup(ip);
    if(geo.region === "KL"){
        next();
    }else{
        res.status(200).json({"code":406,message: resp[406] })
    }
    
    
}

module.exports =  { validateLocation }