import express from 'express'
import { createcourse, deleteCourse, getallCourse, getbatchesinsingleC, getCourse, getCourseAggregatedStats, getCourseDashboardData, modifyCourse, new_realease_courses } from '../controllers/course.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import rolevalidate from '../middlewares/role.middleware.js'

const courseRoute = express.Router()

courseRoute.post('/create',authenticate,rolevalidate('admin'), createcourse)
courseRoute.get('/getallcourse', getallCourse)
courseRoute.get('/getsingle/:id', getCourse)
courseRoute.get('/new_realese', new_realease_courses)
courseRoute.patch('/updatecourse/:id',authenticate, rolevalidate('admin', "instructor"), modifyCourse)
courseRoute.delete('/courses/:id', authenticate, rolevalidate('admin'), deleteCourse )
courseRoute.get('/getDashboarddata', authenticate, rolevalidate('admin'), getCourseDashboardData)
courseRoute.get('/getcoursestat/:courseId', getCourseAggregatedStats)
courseRoute.get('/getbatchdata/:id', getbatchesinsingleC)

export default courseRoute