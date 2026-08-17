import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import ConnectDB from "./db/db.connection.js";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

console.log("Starting on port", PORT);

ConnectDB()
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO db connection failed !!!", err);
  });




// import dotenv from "dotenv"
// import ConnectDB from "./db/db.connection.js";
// import app from "./app.js";
// import dns from "node:dns";
// dns.setServers(["8.8.8.8", "8.8.4.4"]);
// dotenv.config({
//     path: './.env'
// })

// ConnectDB()
// .then(() => {
//     app.listen(process.env.PORT || 5000, () => {
//         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//     })
// })
// .catch((err) => {
//     console.log("MONGO db connection failed !!! ", err);
// })











/*
import express from "express"
const app=express
(async()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.listen(process.env.PORT,()=>{
      console.log("Database connected Succesfully");
    })
  } catch (error) {
    console.log("Error found in the db connection",error);
    
  }
})
  */
