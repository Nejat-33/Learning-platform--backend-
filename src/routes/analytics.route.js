import express from 'express'
import { getInstructorAnalytics,selectedInsAnalytics, getStudentAnalytics, getCourseAnalytics, getpaltformAnalyt, globalcomplition } from '../controllers/analytics.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import rolevalidate from '../middlewares/role.middleware.js'


const analyticsRouter = express.Router()


analyticsRouter.get('/instructor',authenticate, rolevalidate('instructor', 'admin'), getInstructorAnalytics)
analyticsRouter.get('/student',authenticate, rolevalidate('admin', 'student'), getStudentAnalytics)
analyticsRouter.get('/course/:id', getCourseAnalytics)
analyticsRouter.get('/getAnalyt', getpaltformAnalyt)
analyticsRouter.get('/complitionrate', globalcomplition)
analyticsRouter.get('/selectedInsdata/:id',selectedInsAnalytics)


export default analyticsRouter