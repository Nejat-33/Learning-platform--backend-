import Attendence from "../models/attendence.model.js"
import Enrollment from "../models/enrollment.model.js"
import Session from "../models/session.model.js"
import AppError from "../utils/customerror.handler.js"
import { updateAttendenceAnalytics } from "./analytics.service.js"


export const markAttendaance = async(studentid, scannedToken)=>{
   const session = await Session.findOne({ qrCodeToken: scannedToken })
    .populate('batch')

   if(!session){
    throw new AppError('invalid qr code: session is not found or qr has changed', 404)
   }

   const now = new Date()
   const tokenAgeInSeconds = (now - session.lastRotaion) / 1000;

   if(tokenAgeInSeconds > 10000){
    throw new AppError("qr code has expired. Please scan the one currently on the screen.", 400)
   }
   
   if(now > session.expirationDate|| !session.isActive){
    throw new AppError('session expired', 400)
   }

   const isenrolled = await Enrollment.findOne({
    student: studentid,
    batch: session.batch._id
   })

   if(!isenrolled){
    throw new AppError("the student is not enrolled", 404)
   }

   const existingAttendence = await Attendence.findOne({
    student: studentid,
    session: session._id
   })

   if(existingAttendence){
    throw new AppError('student already marked', 400)
   }
   const marked = await Attendence.create({
     student: studentid,
     session: session._id,
     batch: session.batch._id,
     date: now,
     markedAt: new Date(),
     status: 'present'
   })


   await updateAttendenceAnalytics(isenrolled._id)
   return marked
}