import Batch from "../models/batch.model.js"
import Session from "../models/session.model.js"
import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"
import crypto from 'crypto'
import { updateSessionAnalytics } from "./analytics.service.js"


export const createSession = async(batchid, instructorid) =>{

    const batch = await Batch.findById(batchid)
    if(!batch) throw new AppError('batch is not found', 404)
    
    if(batch.status !== 'ongoing'){
        throw new AppError('batch is not available')
    }
    
    const Instructor = await User.findById(instructorid)
    if(!Instructor) throw new AppError('instructor is not found', 404)
    
    if(Instructor.role !== 'instructor' && Instructor.role !==  'admin'){
        throw new AppError('this user cannot create session')
    }
    
    const activeSession = await Session.findOne({batch: batchid, isActive: true})
    if(activeSession) throw new AppError('there is active session for this batch', 400)
    
    const qrCodeToken = crypto.randomBytes(16).toString('hex')

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1.3);

    const session = await Session.create({
        batch: batchid,
        instructor: instructorid,
        qrCodeToken: qrCodeToken,
        isActive: true,
        expirationDate: expiresAt
    })
    await updateSessionAnalytics(batchid)
    return session
}



export const endSession = async (sessionid, user) =>{
    const session = await Session.findById(sessionid).populate('instructor')

    if(!session) throw new AppError('session is not found', 404)

    if(!session.isActive) throw new AppError('session is already closed', 400)

    const isInstructor = session.instructor._id.toString() === user._id.toString()

    const isAdmin = user.role === 'admin'

    if(!isInstructor && !isAdmin){
        throw new AppError('you dont have a permission')
    }
 
    session.isActive = false
    await session.save()
    await updateSessionAnalytics(session.batch)
    return session
}


export const getSessionbybatch = async(batchid)=>{  
    const batch = await Batch.findOne({_id: batchid})
    if(!batch) {
        throw new AppError('batch is not found', 404)
    }
    const session = await Session.findOne({batch: batchid}).populate('instructor', 'name email').sort({date: -1})

    return session
}



export const getsinglesession = async(sessionid)=>{
    const session = await Session.findById(sessionid).populate('batch').populate('instructor', 'name email role')
    if(!session){
        throw new AppError('session is not found', 404)
    }
    return session
}

export const checkSessionStatus = async (sessionId) => {
    const session = await Session.findById(sessionId);

    if (new Date() > session.expirationDate && session.isActive) {
        session.isActive = false;
        await session.save();
        throw new AppError('This session has already expired.', 410);
    }

    return session;
};

