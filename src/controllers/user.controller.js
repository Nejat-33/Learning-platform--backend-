import { modifycourse } from "../services/courseservice.js"
import {  countActiveuser, deleteuser, getAlluser, getme, getuser } from "../services/user.service.js"


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
        const {id} = req.params
        const result = await modifycourse(id, req.body)

        res.status(200).json({
            sucess: true,
            message: "successfully modified profile",
            data: result
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