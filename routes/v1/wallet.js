const express = require('express');
const router = express.Router();
const resp = require('./data/response')
const {wallets} = require('../../models/wallet');
const { validateWalletUpdate } = require('./middlewares/validator');

router.put("/add-transaction",validateWalletUpdate,(req,res)=> {
   
     wallets.findById(req.user.wallet).then(wallet1 => {

        if( req.body.transaction_type =='withdraw'){
            if(wallet1.amount - wallet1.reserved_amount - req.body.amount >= 0  ){
                wallet1.amount = wallet1.amount - req.body.amount;
            }else{
                res.status(200).json({code: 450,message:"Not enough Balance" });
                return;
            } 
        }else{
            wallet1.amount = wallet1.amount + req.body.amount;   
        }
        let transaction = {};
        //add transaction


        transaction["amount"] = req.body["amount"];
        transaction["transaction_type"] = req.body["transaction_type"];



        wallet1.transactions.splice(0,0,transaction);

        wallet1.save().then(wallet1 => {
            res.status(201).json({code: 200,message:"Success",result: {amount: wallet1.amount, transaction: wallet1.transactions[0]} });
        }).catch(err => {
            res.status(200).json({code: 500,message:resp[500],result: wallet1 });
        })

    })
})

router.get('/amount',(req,res) => {
    wallets.findById(req.user.wallet).select('amount').then(wallet1 => { 
        res.status(201).json({code: 200,message:"Success",result: {amount: wallet1.amount}});
    });
})

router.get('/transactions',(req,res) => {
    wallets.findById(req.user.wallet).select('transactions').then(wallet1 => { 
        res.status(201).json({code: 200,message:"Success",result: {transactions: wallet1.transactions}});
    });
})



module.exports = router