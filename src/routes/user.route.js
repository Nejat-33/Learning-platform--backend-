import express from 'express'
import { deleteUser, getalluser, Getme, getUser, CountActiveuser, getallinstructor } from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import rolevalidate from '../middlewares/role.middleware.js'

const userRoute = express.Router()

userRoute.get('/getall',authenticate,getalluser )
userRoute.get('/users/:id', getUser )
userRoute.get('/me', authenticate, Getme)
userRoute.delete('/users/:id', authenticate, deleteUser)
userRoute.get('/getActiveuser', authenticate,rolevalidate('admin'), CountActiveuser)
userRoute.get('/getinstructors',authenticate, rolevalidate('admin'), getallinstructor)

export default userRoute