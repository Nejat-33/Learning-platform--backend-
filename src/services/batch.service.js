import mongoose from "mongoose"
import Batch from "../models/batch.model.js"
import Course from "../models/course.model.js"
import Users from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"
import { attendanceheatmap } from "./attendence.service.js"
import Session from "../models/session.model.js"
import Attendence from "../models/attendence.model.js"


export const createbatch = async(payload, user_id)=>{

    const {course, batchName, startDate, endDate, maxStudent, batch_format,price, instructor, schedule} = payload

   const courseexist = await Course.findById(course)
   if(!courseexist) throw new AppError("course donot exist", 404)


   if(new Date(startDate) >= new Date(endDate)) {
    throw new AppError("end date must be after the start date")
   }
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   const start = new Date(startDate);
   start.setHours(0, 0, 0, 0);

    if (start < today) {
        throw new AppError('Start date cannot be in the past.', 400)
    }

    let status = 'upcoming';
        
        if (start.getTime() === today.getTime()) {
            status = 'active'; 
        } else if (start > today) {
            status = 'ongoing'; 
        }

     if(maxStudent <= 0 ) throw new AppError('max student must be geater than 0')

    
     let scheduleToSave = undefined
     if (schedule) {
         const validDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
         const { days, time } = schedule
         if (!Array.isArray(days) || days.length === 0) throw new AppError('schedule.days must be a non-empty array', 400)
         const invalid = days.find(d => !validDays.includes(d))
         if (invalid) throw new AppError(`invalid day in schedule: ${invalid}`, 400)
         if (!time || typeof time !== 'string') throw new AppError('schedule.time must be a string', 400)
         scheduleToSave = { days, time }
     }
  
     if (!scheduleToSave) {
         throw new AppError('schedule is required and must include days and time', 400)
     }

        // normalize and validate batch_format
        const validFormats = ["weekday-intensive","weekend-only","self-placed"]
        let formatToUse = undefined
        if (batch_format && typeof batch_format === 'string') {
            const normalized = batch_format.trim().toLowerCase()
            // map common variants
            const map = {
                'weekdayintensive': 'weekday-intensive',
                'weekday-intensive': 'weekday-intensive',
                'weekday intensive': 'weekday-intensive',
                'weekendonly': 'weekend-only',
                'weekend-only': 'weekend-only',
                'weekend only': 'weekend-only',
                'selfplaced': 'self-placed',
                'self-placed': 'self-placed',
                'self placed': 'self-placed'
            }
            const key = normalized.replace(/\s+/g, '')
            formatToUse = map[key] || map[normalized] || map[batch_format] || undefined
        }
        if (!formatToUse) {
            throw new AppError('batch_format is required and must be one of: ' + validFormats.join(', '), 400)
        }

    const batch = await Batch.create({
        course: course,       
        instructor, 
        batchName,
        startDate,
        endDate,
        status,
        maxStudent,
        batch_format: formatToUse,
        price,
        schedule: scheduleToSave,
    })
      await batch.save()

    return batch
}


export const getAllbatches = async (query) => {
  const filter = {isDeleted: false, ...query}

  const batches = await Batch.find(filter)
    .populate("course")
    .populate("instructor", "name email")
    .sort({ createdAt: -1 });

  return batches;
}

export const getallbatchofinstructor = async(id)=>{
    const batches = await Batch.find({instructor: id, isDeleted: false}) .populate('course', 'title')
        .populate('instructor', 'firstname lastname')
        .sort({ createdAt: -1 });

    return batches
}


export const fetchBatchService = async(id)=>{

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new AppError("invalid batch id", 400)
    }

    const batch  = await Batch.findById(id).populate('course').populate('instructor')
  
    
    if(!batch) throw new AppError("batch do not found", 404)
    return batch
}


export const updatebatch = async(id,updatedata)=>{

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new AppError("invalid batch id", 400)
    }

    const batch = await Batch.findById(id)
    if(!batch) throw new AppError("batch not found", 404)

    if(batch.status == 'completed'){
        throw new AppError('can not change any thing the batch is completed')
    }

    if(new Date(updatedata.startDate) >= new Date(updatedata.endDate)){
        throw new AppError('end date must be greater than the start date')
    }

    const updatebatch = await Batch.findByIdAndUpdate(id,
      updatedata,
     {new: true})

   return updatebatch
}


export const deletebatch = async(id)=>{
   const batch = await Batch.findById(id)
   if(!batch) throw new AppError('the batch is not found')

   batch.isDeleted = true
   await batch.save()
   return batch
}


export const getbatchesforcourse = async(courseid)=>{
    if(!mongoose.Types.ObjectId.isValid(courseid)) {
        throw new AppError('invalid course id', 400)
    }
    
    const course = await Course.findById(courseid)
    if(!course){
        throw new AppError('the course is not found')
    }
    const batch = await Batch.find({course: courseid}).populate("instructor", "name email").sort({startDate: 1})

    return batch
}



export const getUpcomingBatches = async () => {
    
    const today = new Date();


    const upcomingBatches = await Batch.find({
        startDate: { $gt: today },
        isDeleted: false           
    })
    .sort({ startDate: 1 })        
    .populate('course')           
    .populate('instructor', 'name'); 

    return upcomingBatches;
};



export const getBatchforcourse = async(courseid)=>{
    const batches = await Batch.find({course: courseid}).populate("course").populate("instructor")

    if (!batches){
        throw AppError("batches not found", 404)
    }

    return batches
}


export const getFillingSoon_batch = async()=>{

    const threshold = 5;
    const fillingSoon = await Batch.find({
            $expr: {
                $and: [
                    
                    { $lt: ["$currentStudent", "$maxStudent"] },
                    
                    { $lte: [{ $subtract: ["$maxStudent", "$currentStudent"] }, threshold] }
                ]
            }
        }).populate('course');

    return fillingSoon
}



export const getstat = async()=>{
    const Totalbatch = await Batch.countDocuments()
    const Activebatch = await Batch.countDocuments({status: "ongoing"})
    const Completedbatch = await Batch.countDocuments({status: "completed"})
    const attendancedata = await attendanceheatmap()
    const lowattendance = attendancedata.filter(batch=> batch.intensity < 50)

    return {
        TotalBatch: Totalbatch,
        Activebatch : Activebatch,
        CompletdBatch : Completedbatch,
        Lowattendence : lowattendance.length
    }
}

export const totalsessionofbatch = async(batchid)=>{
    const session = await Session.find({batch : batchid})
    const TotalSession = session.length

    return  TotalSession
}



export const getBatchAverageAttendance = async (batchId) => {
    const totalattendance = await Attendence.countDocuments({batch: batchId, isDeleted: false})
    const totalpresent = await Attendence.countDocuments({batch: batchId ,status: 'present', isDeleted: false})

    if (totalattendance == 0){
        return {
            "averageAttendance" : 0
        }
    }
    return Math.round((totalpresent/totalattendance) * 100)
};




export const getAtRiskStudents = async (batchId, threshold = 75) => {
    const objectId = new mongoose.Types.ObjectId(batchId);

    const atRiskStudents = await Attendence.aggregate([
        {
            $match: {
                batch: objectId,
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$student",
                totalSessions: { $sum: 1 },
                presentCount: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "present"] }, 1, 0]
                    }
                },
                absentCount: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "absent"] }, 1, 0]
                    }
                }
            }
        },
        {
            $project: {
                studentId: "$_id",
                totalSessions: 1,
                presentCount: 1,
                absentCount: 1,
                attendancePercentage: {
                    $multiply: [
                        { $divide: ["$presentCount", "$totalSessions"] },
                        100
                    ]
                }
            }
        },
        {
            $match: {
                attendancePercentage: { $lt: threshold }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'studentId',
                foreignField: '_id',
                as: 'studentInfo'
            }
        },
        {
            $unwind: "$studentInfo"
        },
        {
            $project: {
                studentId: 1,
                totalSessions: 1,
                presentCount: 1,
                absentCount: 1,
                attendancePercentage: 1,
                firstname: "$studentInfo.firstname",
                lastname: "$studentInfo.lastname",
                email: "$studentInfo.email"
            }
        }
    ]);

    return atRiskStudents;
};




export const singlebatchstat = async(batchid)=>{
    
    const totalsession = await totalsessionofbatch(batchid)
    const averageAttendance = await getBatchAverageAttendance(batchid)
    const batch = await fetchBatchService(batchid)
    
    return {
        Totalsession: totalsession,
        avgAttendance: averageAttendance,
        TotalStudent : batch.currentStudent,
    }
}



export const getAverageAttendedStudents = async (batchId) => {
    const objectId = new mongoose.Types.ObjectId(batchId);

    const result = await Attendence.aggregate([
        { 
            $match: { 
                batch: objectId, 
                status: 'present', 
                isDeleted: false 
            } 
        },
        { 
            $group: {
                _id: "$session",
                attendedCount: { $sum: 1 }
            }
        },
        { 
            $group: {
                _id: null,
                avgAttendedStudents: { $avg: "$attendedCount" },
                totalSessions: { $sum: 1 }
            }
        }
    ]);

    return {
        avgAttendedStudents: Math.round(result[0]?.avgAttendedStudents || 0),
        totalSessions: result[0]?.totalSessions || 0
    };
};



export const getWeeklyAttendanceTrends = async (batchId) => {
    const objectId = new mongoose.Types.ObjectId(batchId);

    const trends = await Attendence.aggregate([

        {
            $match: {
                batch: objectId,
                isDeleted: false
            }
        },
        {
            $group: {
                _id: { $week: "$markedAt" },
                presentCount: {
                    $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
                },
                totalCount: { $sum: 1 }
            }
        },
        {
            $sort: { "_id": 1 }
        },
        {
            $project: {
                week: "$_id",
                intensity: {
                    $multiply: [
                        { $divide: ["$presentCount", "$totalCount"] },
                        100
                    ]
                }
            }
        }
    ]);

    return trends
    
};