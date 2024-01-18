const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const {MONGO_DB} = process.env;
// mongodb+srv://barodaweb:Barodaweb-mongo2022@cluster0.jruibih.mongodb.net/PushtiShangar_database?retryWrites=true&w=majority
const connectToMongo  = ()=>{
    mongoose.connect( MONGO_DB ,{
        useNewUrlparser: true,
		useUnifiedTopology: true,
    } )
    .then( console.log("\x1b[34m >>> \x1b[36m 😁 \x1b[32mDATABASE Connection Successs\x1b[0m 👍"))
    .catch((error)=>{
        console.log("❗️DB connection failed ❗️");
        console.log(error);
        process.exit(1);
    })
}


module.exports = connectToMongo;