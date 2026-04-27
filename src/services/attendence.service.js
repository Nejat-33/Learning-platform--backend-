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



export const attendanceheatmap = async () => {
  const heatmap = await Attendence.aggregate([
    { $match: { isDeleted: false } },
    
    // 1. Group (Your working logic)
    {
      $group: {
        _id: {
          session: "$session",
          week: { $isoWeek: "$markedAt" },
          year: { $isoWeekYear: "$markedAt" }
        },
        totalStudents: { $sum: 1 },
        totalPresent: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
        }
      }
    },

    // 2. Convert Session ID to ObjectId and Join Sessions
    {
      $lookup: {
        from: "sessions", 
        let: { session_id: "$_id.session" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$session_id" }] } } }
        ],
        as: "sessionDoc"
      }
    },
    { $unwind: { path: "$sessionDoc", preserveNullAndEmptyArrays: true } },

    // 3. Join Batches using the batch ID from sessionDoc
    {
      $lookup: {
        from: "batches",
        localField: "sessionDoc.batch",
        foreignField: "_id",
        as: "batchDoc"
      }
    },
    { $unwind: { path: "$batchDoc", preserveNullAndEmptyArrays: true } },

    // 4. Final Projection
    {
      $project: {
        _id: 0,
        // If batchDoc.name is missing, it will show "Unnamed Batch" so we can debug
        name: { $ifNull: ["$batchDoc.batchName", "Unknown Batch"] }, 
        week: "$_id.week",
        year: "$_id.year",
        intensity: {
          $cond: [
            { $gt: ["$totalStudents", 0] },
            { $multiply: [{ $divide: ["$totalPresent", "$totalStudents"] }, 100] },
            0
          ]
        }
      }
    }
  ]);


  return heatmap;
};



export const markAbsentStudents = async (sessionId, batchid) => {

  const students = await Enrollment.find({ batch: batchid}).select("student");

  const presentRecords = await Attendence.find({ session: sessionId });

  const presentStudentIds = presentRecords.map(r => r.student.toString());

  
  const absentStudents = students
        .filter(enrollment => {
            const studentIdStr = enrollment.student.toString(); 
            const isPresent = presentStudentIds.includes(studentIdStr);
  
            return !isPresent; 
        })
        .map(enrollment => ({
            student: enrollment.student,
            session: sessionId,
            status: 'absent'
        }));

  if (absentStudents.length > 0) {
       const attendendance=  await Attendence.insertMany(absentStudents);  
  }
};