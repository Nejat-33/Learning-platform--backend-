import { modifycourse } from "../services/courseservice.js"
import {  countActiveuser, deleteuser, getAlluser, getinstructor, getme, getuser, modifyprofile } from "../services/user.service.js"


export const getalluser = async(req, res, next) =>{
    try {
        const result = await getAlluser(req.query)
        
        res.status(200).json({
            success: true,
            messgae: "sucessfully filered all user",
            data: result
        })
    } catch (error) {
        next(error)
    }
}


export const getUser = async(req, res, next) =>{
    try {
        const {id} = req.query
        const result = await getuser(id)

        res.status(200).json({
            success: true,
            messgae: "sucessfully filered all user",
            data: result
        })

    } catch (error) {
        next(error)
    }
}

export const Getme = async(req, res, next)=>{
    try {
        const user = await getme(req.user.id)
        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async(req, res, next) =>{
    try{
        const {id} = req.query
        const result = await deleteuser(id)
        res.status(200).json({
            success: true,
            messgae: "sucessfully deleted user",
            data: result
        })
    }catch(error){
      next(error)
    }
}


export const updateProfile = async (req, res, next) =>{
    try {
        const id = req.user._id; 
        
        const allowedFields = ['firstname', 'lastname', 'phone', 'instructorProfile','profileImage'];
        const updateData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        });

        if (req.file) {
            updateData.profileImage = req.file.path || req.file.filename;
        }

        const result = await modifyprofile(id, updateData);

        res.status(200).json({
            sucess: true,
            message: "successfully modified profile",
            data:{user: result}
        })
    } catch (error) {
        next(error)
    }
}

export const CountActiveuser = async(req, res, next)=>{
    try {
        const result = await countActiveuser()
        res.status(200).json({
            success: true,
            message: "you have sucessfully get number of active user",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getallinstructor = async(req, res, next)=>{
    try {
        const instructor = await getinstructor()

        res.status(200).json({
            success: true,
            data: instructor
        })
    } catch (error) {
        next(error)
    }
}

export const getTopinst = async(req, res, next)=>{
    try {
        const instr = await getinstructor()
        res.status(200).json({
            success: true,
            data: instr
        })
    } catch (error) {
        next(error)
    }
}