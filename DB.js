const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = 'mongodb://127.0.0.1:27017/practice';
// const mongoURL = process.env.DB_URL

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("connected to mongodb server"); 
});

db.on('error',(err)=>{
    console.log("Error to mongodb server"); 
});

db.on('disconnected',()=>{
    console.log("Disconnected mongodb server"); 
});


module.exports = db;
