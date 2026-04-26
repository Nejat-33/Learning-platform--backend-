import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"



export const getAlluser = async(query)=>{
    const filter = {isActive: true, ...query}
    const users = await User.find(filter)
    if(!users){
        throw new AppError("there is no user")
    }
    return users
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
     const user = await User.findOne({_id:id, isDeleted: false})

     if (!user){
        throw new AppError("user is not found", 404)
     }
     const updateduser = await User.findByIdAndUpdate(id, {$set: updateddata}, {new: true})

     return updateduser
}