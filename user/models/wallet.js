const mongoose = require('mongoose');
const validator = require('validator');

const transactionsSchema = new mongoose.Schema({
    transaction_type: {
        type:"String",
        enum:["withdraw","deposit"],
        
    },
    amount : Number,
    
    created_at: {
        type: Date,
        default: Date.now
    },
}) 

const walletSchema = new mongoose.Schema({
    amount: {
        type:Number,
        default:0
    },
    reserved_amount: Number,
    transactions: [
        transactionsSchema
    ]
  })

const wallets = mongoose.model('Wallet', walletSchema);



module.exports = {
    wallets,

}