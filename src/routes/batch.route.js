import express from "express";
import { createBatch, deleteBatch, getAllBatches, getBatchforcourse, getSinglebatch, updateBatch } from "../controllers/batch.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import rolevalidate from "../middlewares/role.middleware.js";


const batchRoute = express.Router()

batchRoute.get('/getbatch/:id', getSinglebatch)
batchRoute.get('/getbatch', getAllBatches)
batchRoute.post('/createbatch',authenticate, rolevalidate('admin'), createBatch)
batchRoute.get('/getbatchofcourse', getBatchforcourse)
batchRoute.patch('/updatebatch/:id', authenticate,rolevalidate('admin', "instructor"), updateBatch)
batchRoute.delete('/deletebatch/:id', authenticate, rolevalidate('admin', 'instructor'), deleteBatch)

export default batchRoute