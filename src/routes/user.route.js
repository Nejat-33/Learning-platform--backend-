import express from 'express'
import { deleteUser, getalluser, Getme, getUser, CountActiveuser, getallinstructor, getTopinst } from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import rolevalidate from '../middlewares/role.middleware.js'
import multer from 'multer'
import { updateProfile } from '../controllers/user.controller.js'

const upload = multer({dest: 'upload/'})

const userRoute = express.Router()

userRoute.get('/getall',authenticate,getalluser )
userRoute.get('/users/:id', getUser )
userRoute.get('/me', authenticate, Getme)
userRoute.delete('/users/:id', authenticate, deleteUser)
userRoute.get('/getActiveuser', authenticate,rolevalidate('admin'), CountActiveuser)
userRoute.get('/getinstructors',authenticate, rolevalidate('admin'), getallinstructor)
userRoute.get('/getinstructorforgallery', getTopinst)
userRoute.patch('/updateprofile', authenticate, upload.single('profileImage'), updateProfile)
export default userRoute

