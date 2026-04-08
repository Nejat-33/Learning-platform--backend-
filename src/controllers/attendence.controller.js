import { markAttendaance } from "../services/attendence.service.js"
import AppError from "../utils/customerror.handler.js"



export const scanAttendenceQr = async(req, res, next)=>{
    try {

    const {qrToken} = req.body
    const studentid = req.user._id
    if(!qrToken){
        throw new AppError("No qr scanned")
    }
    const attendenceRecord = await markAttendaance(studentid, qrToken)
    res.status(200).json({
        success: true,
        message: "the attendence is successfuly scaned",
        data: attendenceRecord
    })

    } catch (error) {
        next(error)
    }
}
