require('dotenv').config();
require('./services/redis_db');
const {verifyAccessToken} = require("./routes/v1/middlewares/token");
const { validateLocation } = require('./routes/v1/middlewares/location')
process.env.TZ = 'Asia/Calcutta'
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors')
//const redis = require("./services/redis_db")

const app = express();
app.use(cors())
const PORT = process.env.PORT;

app.use(express.json());
app.set('trust proxy', 1);
const {mongo_init} = require("./services/mongo_db")

const auth = require('./routes/v1/auth');
app.use('/v1/auth', auth);

const profile = require('./routes/v1/profile');
app.use('/v1/profile',verifyAccessToken, profile);

const wallet = require('./routes/v1/wallet');
app.use('/v1/wallet',verifyAccessToken, wallet);

const share = require('./routes/v1/vechicle_share');
app.use('/v1/share', verifyAccessToken,share);

mongo_init(mongoose).then(()=> {
  mongoose.mongo_init = mongo_init;
  const server = app.listen(
    PORT,
    () => console.log(`User service is running on port : ${PORT}`)
  )

}).catch((err) => {
  console.log(`Error occured in db ${err}`);
})




