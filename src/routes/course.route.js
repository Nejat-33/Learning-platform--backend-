import express from 'express'
import { createcourse, deleteCourse, getallCourse, getCourse, modifyCourse, new_realease_courses } from '../controllers/course.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import rolevalidate from '../middlewares/role.middleware.js'

const courseRoute = express.Router()

courseRoute.post('/create',authenticate,rolevalidate('admin'), createcourse)
courseRoute.get('/getallcourse', getallCourse)
courseRoute.get('/courses/:id', getCourse)
courseRoute.get('/new_realese', new_realease_courses)
courseRoute.patch('/courses/:id',authenticate, rolevalidate('admin'), modifyCourse)
courseRoute.delete('/courses/:id', authenticate, rolevalidate('admin'), deleteCourse )


export default courseRoute