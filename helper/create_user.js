const user = require('../models/user');
const wallets = require('../models/wallet');

const  createUser = function(req)  {
    let user1 = new user();
    
    user1.phone = req.body.phone;



    //for(let [key,value ] of Object.entries(req.body.device)) {

    //    user1.device[key] = value;
    //}
    return new Promise((resolve,reject) => {
       new wallets().save().then(new_wallet => {
            user1.wallet = new_wallet._id;
            user1.save().then(new_user => {
                resolve(new_user)
            }).catch(err => {
                reject(err);
            })
        }).catch(err => {
            reject(err);
        })
        
    })
} 

module.exports = { createUser }