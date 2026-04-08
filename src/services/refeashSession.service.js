import Session from "../models/session.model"
import AppError from "../utils/customerror.handler"
import crypto from 'crypto'

export const refreashSession = async (sessionid, instructor)=>{
    try {
        const session = await Session.findOne({
            _id: sessionid,
            instructor: instructor
        })

        if(!session|| !session.isActive){
            throw new AppError("Session not found")
        }

        const newqr = crypto.randomBytes(32).toString('hex');

        session.qrCodeToken = newqr
        session.lastRotaion = new Date()
        await session.save()

        return session
    } catch (error) {
        next(error)
    }
}