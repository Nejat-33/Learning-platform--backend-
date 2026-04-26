import express from "express";
import { createBatch, deleteBatch, getAllBatches, getBatchforcourse, getSinglebatch, updateBatch, get_upcomingBatches, getAllbatch_course, getFilling_batch } from "../controllers/batch.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import rolevalidate from "../middlewares/role.middleware.js";


const batchRoute = express.Router()

batchRoute.get('/getbatch/:id', getSinglebatch)
batchRoute.get('/getallbatch', getAllBatches)
batchRoute.post('/createbatch',authenticate, rolevalidate('admin'), createBatch)
batchRoute.get('/getbatchofcourse', getBatchforcourse)
batchRoute.patch('/updatebatch/:id', authenticate,rolevalidate('admin', "instructor"), updateBatch)
batchRoute.delete('/deletebatch/:id', authenticate, rolevalidate('admin', 'instructor'), deleteBatch)
batchRoute.get("/upcoming", get_upcomingBatches)
batchRoute.get("/batches/course/:id", getAllbatch_course)
batchRoute.get("/fillingsoon", getFilling_batch)

export default batchRoute