import express from "express"
import { completeenrollment, createEnrollment, getEnrollment, getEnrollmentbyBatch, getEnrollmentofStudent, getmyenrollment, modifyEnrollment, updateFinalGrade } from "../controllers/enrollment.controller.js"
import rolevalidate from "../middlewares/role.middleware.js"
import { authenticate } from "../middlewares/auth.middleware.js"

const enrollmentRoute = express.Router()

enrollmentRoute.get('/get',authenticate, rolevalidate('admin'), getEnrollment)
enrollmentRoute.post('/create/:batchid', authenticate, createEnrollment)
enrollmentRoute.get('/batch/:batchid',authenticate,rolevalidate('admin', 'instructor'), getEnrollmentbyBatch)
enrollmentRoute.get('/student/:studentid',authenticate,rolevalidate('admin') ,getEnrollmentofStudent)
enrollmentRoute.get('/getmy',authenticate, getmyenrollment)
enrollmentRoute.patch('/update/:id',authenticate,rolevalidate('admin'), modifyEnrollment)
enrollmentRoute.patch('/updatefinalgrade/:id', authenticate, rolevalidate('admin', 'instructor', ), updateFinalGrade)
enrollmentRoute.patch('/complete/:id', authenticate, completeenrollment)
export default enrollmentRoute