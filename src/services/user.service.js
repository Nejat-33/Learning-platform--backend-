import Attendence from "../models/attendence.model.js"
import Batch from "../models/batch.model.js"
import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"
import { totalsessionofbatch } from "./batch.service.js"



export const getAlluser = async(query)=>{
    const filter = {isActive: true, ...query}
    const users = await User.find(filter)
    if(!users){
        throw new AppError("there is no user")
    }
    return users
}

export const countActiveuser = async()=>{
   const countactiveuser = await User.countDocuments({isActive: true})
   const countactiveStudent = await User.countDocuments({role: 'student', isActive: true})
   const countactiveinstructor = await User.countDocuments({role: 'instructor', isActive: true})
   const countactiveadmin = await User.countDocuments({role: 'admin', isActive: true})

   
   const number = {
            "Totalactiveuser": countactiveuser,
            "numberofActiveinstructor": countactiveinstructor,
            "numberofActiveadmin" : countactiveadmin,
            "numberofActivestudent": countactiveStudent
        }

   return number
}

export const getuser = async(id)=>{
   const user = await User.findOne(id)
   if(!user) {
    throw new AppError('')
   }
   return user
}

export const getme = async(id)=>{
    const user = await User.findById(id)
    if(!user){
        throw AppError("user not found", 404)
    }

    return user
}


export const deleteuser = async (id) =>{
   const user = await User.findOne(id).populate({isActive: true})
   if(!user){
    throw new AppError('user is not active')
   }
   user.isActive = false
   return user
}



export const modifyprofile = async(id, updateddata)=>{
     const user = await User.findOne({_id:id, isActive: true})

     if (!user){
        throw new AppError("user is not found", 404)
     }
     const updateduser = await User.findByIdAndUpdate(id, {$set: updateddata}, {new: true})

     return updateduser
}


export const attendanceData = async(id,batchid)=>{
    const user = await User.findOne({_id: id, isDeleted: false})

    if(!user){
       throw new AppError("user is not found", 404)
    }
    const batch = await Batch.find({_id: batchid})
    if(!batch){
        throw new AppError("batch is not found", 404)
    }

    const totalsession = await totalsessionofbatch(batchid)
    if (!totalsession){
        throw new AppError("there is session yet", 400)
    }
    const totalpresent = await Attendence.find({student: id, batch: batchid, status: 'present'})
    let isrisky = false

    if ((totalpresent/totalsession)*100 < 75){
        isrisky = true
    }
    
}


export const getinstructor = async()=>{
    const instructor = await User.find({role: "instructor", isActive : true})
    if(!instructor){
        throw new AppError("cnnot get instructor ", 404)
    }
    return instructor
}