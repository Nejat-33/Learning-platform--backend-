import express from 'express'
import { getCompanyAnalytics, getInstructorAnalytics, getStudentAnalytics } from '../controllers/analytics.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const dashboardRoute = express.Router()

dashboardRoute.get('/dashboard/admin',authenticate, getCompanyAnalytics)
dashboardRoute.get('/dashboard/instuructor',authenticate, getInstructorAnalytics)
dashboardRoute.get('/dashboard/student',authenticate, getStudentAnalytics)



export default dashboardRoute