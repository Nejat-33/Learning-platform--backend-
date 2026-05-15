import express from "express";
import { createBatch, deleteBatch, getAllBatches, getBatchforcourse, 
    getSinglebatch, updateBatch, get_upcomingBatches, getAllbatch_course, 
    getFilling_batch, getStatofbatch, batchAverageAttendanceController, Singlebatchstat, 
    getAverageAttendedStudentsController,
    getWeeklyTrendsController,
    getmybatch,
    getbatchInst} from "../controllers/batch.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import rolevalidate from "../middlewares/role.middleware.js";
import { getAverageAttendedStudents } from "../services/batch.service.js";


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
batchRoute.get("/batchstat",authenticate,rolevalidate('admin'), getStatofbatch)
batchRoute.get('/averageattendance/:batchId', batchAverageAttendanceController)
batchRoute.get("/singlebatchstat/:batchid", Singlebatchstat)
batchRoute.get('/avgAttendancecount/:batchId', getAverageAttendedStudentsController)
batchRoute.get('/getWeeklyTrends/:batchId', getWeeklyTrendsController)
batchRoute.get('/mybatch',authenticate, getmybatch)
batchRoute.get('/mybatchInst',authenticate, rolevalidate('instructor'),getbatchInst)


export default batchRoute