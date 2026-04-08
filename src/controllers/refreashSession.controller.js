
import { refreashSession } from "../services/refeashSession.service"


export const refeashSession = async(req,res,next )=>{
    try {
        const sessionid = req.params
        const instructor = req.user._id
        const neqQr = await refreashSession(sessionid, instructor)

        res.status(200).json({
            success: true,
            message: "successfully qrupdated",
            expiresIn: 15,
            data: neqQr
        })
    } catch (error) {
        next(error)
    }
}