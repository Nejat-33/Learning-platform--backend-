import express from 'express'
import { closesession, createsession, getsingleSession } from '../controllers/session.controller.js'
import { getSessionBybatch } from '../controllers/session.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import rolevalidate from '../middlewares/role.middleware.js'
const sessionRouter = express.Router()


sessionRouter.get('/getsingle/:id', authenticate,rolevalidate('admin', 'instructor'), getsingleSession)
sessionRouter.get('/batch/:batchid', authenticate ,rolevalidate('admin', 'instructor') ,getSessionBybatch)
sessionRouter.post('/create/:batchid', authenticate, rolevalidate('admin','instructor'), createsession)
sessionRouter.patch('/close/:id',authenticate,rolevalidate('admin', 'instructor') , closesession)




export default sessionRouter