import express from 'express'
import { getAttendanceHeatmap, scanAttendenceQr } from '../controllers/attendence.controller.js'
import {authenticate }from '../middlewares/auth.middleware.js'

const attendenceRoute = express.Router()

// attendenceRoute.get('/attendence/attendenceAnalytics/:student', )
// attendenceRoute.get('/attendence/attendenceAnalytics/:batch', )
attendenceRoute.post('/mark', authenticate , scanAttendenceQr)
attendenceRoute.get('/getAttendenceHeatmap', getAttendanceHeatmap)

export default attendenceRoute