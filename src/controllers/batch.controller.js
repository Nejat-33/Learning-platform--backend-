import { createbatch, deletebatch, getAllbatches, getbatchesforcourse, getsinglebatch, updatebatch } from "../services/batch.service.js"


export const getSinglebatch = async(req, res, next)=>{
    try {
        const {id} = req.params
        const batch = await getsinglebatch(id)
        
        res.status(200).json({
            sucess: true,
            meassage: "sucessfully get the batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}

export const createBatch = async(req, res, next)=>{
    try {
        const user = req.user._id
        const batch = await createbatch(req.body, user)
        res.status(200).json({
            suceess: true,
            meassage: "sucessfully create the batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}


export const getAllBatches = async(req, res, next)=>{
    try {
        const batch = await getAllbatches(req.query)

        res.status(200).json({
            success: true,
            meassage: "sucessfully get all batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}

export const updateBatch = async(req, res, next)=>{
    try {
        const {id} = req.params
        const batch = await updatebatch(id,req.body)

        res.status(200).json({
            sucess: true,
            meassage: "sucessfully update the batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}

export const deleteBatch = async(req, res, next)=>{
    try {
        const {id } = req.params
        const batch = await deletebatch(id)

        res.status(200).json({
            sucess: true,
            message: "sucessfully delete batch"
        })
    } catch (error) {
        next(error)
    }
}

export const getBatchforcourse = async(req, res, next)=>{
    try {
        const courseid = req.params
        const batch = await getbatchesforcourse(courseid)

        res.status(200).json({
            sucess: true,
            message: "sucessfully get batch for batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}