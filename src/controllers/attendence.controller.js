import { attendanceheatmap, markAttendaance } from "../services/attendence.service.js"
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

export const getAttendanceHeatmap = async (req, res) => {
  try {
  
   const heatmap = await attendanceheatmap()
   
    const high = heatmap.filter(item => item.intensity >= 70).slice(0, 3);
    const low = heatmap.filter(item => item.intensity < 70).slice(0, 3);

    res.status(200).json({ high, low });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
