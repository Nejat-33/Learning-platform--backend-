import express from 'express'
import { scanAttendenceQr } from '../controllers/attendence.controller.js'
import {authenticate }from '../middlewares/auth.middleware.js'

const attendenceRoute = express.Router()

// attendenceRoute.get('/attendence/attendenceAnalytics/:student', )
// attendenceRoute.get('/attendence/attendenceAnalytics/:batch', )
attendenceRoute.post('/mark', authenticate , scanAttendenceQr)

export default attendenceRoute