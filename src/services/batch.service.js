import mongoose from "mongoose"
import Batch from "../models/batch.model.js"
import Course from "../models/course.model.js"
import Users from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"


export const createbatch = async(payload, user)=>{
    if (!payload) throw new AppError("No data provided", 400)
   const {course, startDate, endDate, maxStudent} = payload
   const instructor = user
   const courseexist = await Course.findById(course)
   if(!courseexist) throw new AppError("course donot exist", 404)

   const creatorexist = await Users.findById(instructor)
   if(!creatorexist) throw new AppError("instructor donot exist", 404)

   if(new Date(startDate) >= new Date(endDate)) {
    throw new AppError("end date must be after the start date")
   }

   if(maxStudent < 0 ) throw new AppError('max student must be geater than 0')

    const batch = await Batch.create({instructor: instructor, ...payload})
    return batch
}


export const getAllbatches = async (query) => {
  const filter = {isDeleted: false, ...query}

  const batches = await Batch.find(filter)
    .populate("course", "title")
    .populate("instructor", "name email")
    .sort({ createdAt: -1 });

  return batches;
}

export const getsinglebatch = async(id)=>{
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new AppError("invalid batch id", 400)
    }

    const batch  = await Batch.findById(id).populate('course').populate('createdBy')
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