import express from 'express'
import { deleteUser, getalluser, Getme, getUser } from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const userRoute = express.Router()

userRoute.get('/users/all',authenticate,getalluser )
userRoute.get('/users/:id', getUser )
userRoute.get('/me', authenticate, Getme)
userRoute.delete('/users/:id', authenticate, deleteUser)


export default userRoute