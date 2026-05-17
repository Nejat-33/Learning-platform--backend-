import Attendence from "../models/attendence.model.js"
import Batch from "../models/batch.model.js"
import Enrollment from "../models/enrollment.model.js"
import Payment from "../models/payment.model.js"
import Session from "../models/session.model.js"
import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"
import { updateCompletionAnalytics, updateEnrollmentAnalytics } from "./analytics.service.js"
import {generateCertificate }from './certificate.service.js'


export const createenrollment = async(studentid, batchid)=>{

    const batch = await Batch.findById(batchid).populate("course")
    if(!batch) throw new AppError('batch not found', 404)

    if(batch.status == 'ongoing' || batch.status == 'completed'){
        throw new AppError('batch is not available', 400)
    }
    const courseid = batch.course._id
    const duplicate = await Enrollment.findOne({
        batch: batchid,
        student: studentid
    })
    if(duplicate) throw new AppError('user already registered', 400)

    const updatebatch = await Batch.findOneAndUpdate({
        _id: batchid,
        currentStudent: {$lt: batch.maxStudent}},
        {$inc: {currentStudent: 1}},
        {new: true}
    )
    if(!updatebatch) throw new AppError('batch is full or no longer available', 400)
    const enrollment = await Enrollment.create({
        batch: batchid,
        student: studentid
    })
    return enrollment
}

export const checkcompletion = async(enrollmentid)=>{
    const enrollment = await Enrollment.findById(enrollmentid)
        .populate({path: 'batch', populate: {path: 'course'}})
        .populate('student')

    if(!enrollment) throw new AppError('enrollment is not found', 404)
    
    const session = await Session.find({batch: enrollment.batch._id}).select('_id')
    const sessionids = session.map(s =>s._id)

    const studentAttendence = await Attendence.countDocuments({
        student: enrollment.student._id,
        status: "present",
        session: {$in : sessionids}
    })

    const totalSession = session.length

    if(totalSession == 0) return

    const totalStudentattendence = (studentAttendence/totalSession)*100

    const payment = await Payment.findOne({enrollment: enrollmentid})
    const ispaid = payment?.status == 'paid'

   if (enrollment.finalGrade === undefined || enrollment.finalGrade === null) {
    throw new AppError("The final Grade has not been submitted", 400);
}

    const ispassing = enrollment.finalGrade  >= enrollment.batch.course.passingScore

    if(totalStudentattendence >= 50 && ispaid && ispassing){
     const data =  await makeenrollmentcompleted(enrollmentid)
     await Batch.findByIdAndUpdate(
            batchId,
            { 
                $addToSet: { graduates: enrollment.staudent._id } 
            },
            { new: true }
        )

     await updateCompletionAnalytics(
       enrollment.batch.course._id, 
       enrollment.batch._id, 
       enrollment.student._id
   );
     return data
    } else {
        throw new AppError('Requirements for completion not met (Attendance, Payment, or Grade)', 400)
    }
}


export const makeenrollmentcompleted = async(enrollmentid)=>{
   const enrollment = await Enrollment.findById(enrollmentid)
    
   if(!enrollment) throw new Error('enrollment not found')
    enrollment.status = 'completed'
await enrollment.save();

   const certificate =  await generateCertificate(enrollmentid)
   return certificate
}



export const updatefinalGrade = async(enrollmentid, finalGrade)=>{
    const enrollment = await Enrollment.findOne({_id: enrollmentid, status : "active"})
    if(!enrollment) throw new AppError('enrollment is not found', 404)
     enrollment.finalGrade = finalGrade
    
     await enrollment.save();
    await checkcompletion(enrollmentid)
    return enrollment
}


export const getenrollmentbystudent = async(studentid) => {

    const student = await User.find({student: cleanId}).lean()
    if(!student) {
        throw new AppError('student is not found')
    }
    const enrollment = await Enrollment.findOne({student: studentid})
    return enrollment
}


export const getenrollmentbybatch = async (batchid)=>{

    const enrollment = await Enrollment.find({batch: batchid}).lean()
    if(!enrollment || enrollment.length === 0) {
        throw new AppError('there is no any student enroll in this batch')
    }
    return enrollment
}


export const Getenrollment = async()=>{
    const enrollment = await Enrollment.find()
    if(!enrollment){
        throw new AppError('no enrollment data', 404)
    }
    return enrollment
}

export const Getmyenrollment = async (userid) => {
    const user = await User.findById(userid);
    if (!user) {
        throw new AppError('The user was not found', 404);
    }

    // Use .find() so it returns an array of all their enrollments
    const enrollments = await Enrollment.find({ student: userid });
    
    // Do NOT throw an error if it's empty. Just return the empty array [] safely.
    return enrollments; 
};


export const modifyenrollment = async(id, query)=>{
  
    
    const enrollment = await Enrollment.findOne({_id: id, isDeleted: false})
    if(!enrollment) {
      throw new AppError('can not get enrollment')
    }
    if (enrollment.status == "completed"){
        throw new  AppError('can not modify this enrollment')
    }
    const update = await Enrollment.findByIdAndUpdate(id, {$set: query}, {new: true})

    return update
}