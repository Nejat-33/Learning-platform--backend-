import express from 'express'

import {authenticate }from '../middlewares/auth.middleware.js'
import { getAttendanceLog, getAttendanceSummary, getAttendanceHeatmap, getBatchSessionsAttendance, getSessionAttendance, scanAttendenceQr } from '../controllers/attendence.controller.js'

const attendenceRoute = express.Router()

attendenceRoute.post('/mark', authenticate , scanAttendenceQr)
attendenceRoute.get('/getAttendenceHeatmap', getAttendanceHeatmap)

attendenceRoute.get('/summary', authenticate, async (req, res, next) => {
	try {
		return getAttendanceSummary(req, res, next);
	} catch (err) {
		next(err);
	}
});

attendenceRoute.get('/log', authenticate, async (req, res, next) => {
	try {
		return getAttendanceLog(req, res, next);
	} catch (err) {
		next(err);
	}
});

attendenceRoute.get('/session/:sessionId', authenticate, getSessionAttendance )
attendenceRoute.get('/batch/:batchId/sessions', authenticate, getBatchSessionsAttendance)

export default attendenceRoute