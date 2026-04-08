import dotenv from 'dotenv'
dotenv.config()
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { startBatchStatusScheduler } from './src/utils/batchscheduler.js';
import mongoose from 'mongoose';



connectDB()
app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})

mongoose.connection.on('open', () => {
    startBatchStatusScheduler();
    console.log('Batch Scheduler is active.');
});