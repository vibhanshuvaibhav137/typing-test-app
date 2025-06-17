import dotenv from "dotenv"
import connectDB from "./config/db.js";
import { app } from "./App.js";

dotenv.config({
    path:'./env'
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000 , ()=>{
        console.log(`Server is running at PORT : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO DB connection error !!!", err)
})
