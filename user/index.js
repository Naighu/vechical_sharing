require('dotenv').config();
require('./services/redis_db');

process.env.TZ = 'Asia/Calcutta'
const express = require('express');
const mongoose = require("mongoose");
//const redis = require("./services/redis_db")

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.set('trust proxy', 1);
const {mongo_init} = require("./services/mongo_db")

const authentiction = require('./routes/v1/authentication');
app.use('/v1/auth', authentiction);

mongo_init(mongoose).then(()=> {
  mongoose.mongo_init = mongo_init;
  const server = app.listen(
    PORT,
    () => console.log(`User service is running on port : ${PORT}`)
  )

}).catch((err) => {
  console.log(`Error occured in db ${err}`);
})




