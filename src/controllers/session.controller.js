import { createSession, endSession, getSessionbybatch, getsinglesession } from "../services/session.service.js"



export const createsession = async(req, res, next) =>{
   try {
    const {batchid}= req.params
    const instructor = req.user._id

    
   const result = await createSession(batchid, instructor)

   res.status(201).json({
    sucess: true,
    message: 'sucessfully sesission created',
    body: result
   })
   } catch (error) {
    next(error)
   }
   
}

export const closesession = async(req, res, next)=>{
    try {
         const {id} = req.params
        const user = req.user

    const result = await endSession(id, user)
    res.status(200).json({
        sucess: true,
        message: 'session is closed sucessfully',
        data: result
    })
    } catch (error) {
        next(error)
    }
   
}

export const getSessionBybatch = async(req, res, next) =>{
    try {
         const {batchid} = req.params
     const result = await getSessionbybatch(batchid)

     res.status(200).json({
        sucess: true,
        message: 'session in this batch fetched',
        data: result
     })
    } catch (error) {
        next(error)
    }
    
}


export const getSessionbatch = async(req, res, next) =>{
    try {
         const {batchid} = req.params
     const result = await getSessionbatch(batchid)

     res.status(200).json({
        success: true,
        message: 'session in this batch fetched',
        data: result
     })
    } catch (error) {
        next(error)
    }
    
}


export const getsingleSession = async(req, res, next)=>{
    try {
         const {id} = req.params
    const result = await getsinglesession(id)

    res.status(200).json({
        sucess: true,
        message: 'sucessfully get the session',
        data: result
    })
    } catch (error) {
        next(error)
    }
   
}