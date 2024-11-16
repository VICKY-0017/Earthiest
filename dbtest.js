import mongoose from "mongoose";
import dotenv from "dotenv"
    
dotenv.config();

const Mongo_url = process.env.MongoDb_Connection_string;
const Db_name = process.env.Db_name;


console.log('Mongo URL:', Mongo_url); 
console.log('Database Name:', Db_name); 

mongoose.connect(Mongo_url,{
    dbName:Db_name
}).then(
    ()=>{
        console.log("connected to database");
    }
).catch((err)=>{
    console.log("Error in connecting DB: "+err);
})