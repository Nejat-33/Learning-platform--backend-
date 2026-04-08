import { deleteuser, getAlluser, getme, getuser } from "../services/user.service.js"


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