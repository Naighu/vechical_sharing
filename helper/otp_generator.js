const generateOTP = function(max)  {
    let otp = "";
    for(i=0;i<max;i++) {
        otp += Math.floor((Math.random() * 9) + 1);
    }
    return otp;

} 

module.exports= {generateOTP}