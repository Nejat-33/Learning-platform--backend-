import express from 'express'
import { closesession, createsession, getSessionbatch, getsingleSession } from '../controllers/session.controller.js'
import { getSessionBybatch } from '../controllers/session.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import rolevalidate from '../middlewares/role.middleware.js'
const sessionRouter = express.Router()


sessionRouter.get('/getsingle/:id', authenticate,rolevalidate('admin', 'instructor'), getsingleSession)
sessionRouter.get('/batch/:batchid', authenticate ,rolevalidate('admin', 'instructor') ,getSessionBybatch)
sessionRouter.get('/allbatch/:batchid', authenticate ,rolevalidate('admin', 'instructor') ,getSessionbatch)
sessionRouter.post('/create/:batchid', authenticate, rolevalidate('admin','instructor'), createsession)
sessionRouter.patch('/close/:id',authenticate,rolevalidate('instructor', 'admin') , closesession)




export default sessionRouter