
import { getcoursestat, getGlobalCompletionRate, getGlobalPlatformStats,getselectedInsAnalytics, getinstructorinfo, getrevenuestat, getstudentstat } from "../services/analytics.service.js"


export const getInstructorAnalytics = async(req, res, next)=>{
    try{
    const {id} = req.user.id
    const result = await getinstructorinfo(id)
     res.status(200).json({
        success: true,
        message: "successfull get instructor statistics",
        data: result
     })
    }catch(e){
        next(e)
    }

}

export const selectedInsAnalytics = async (req, res, next)=>{
    try {
        const {id} = req.params
        const result = await getselectedInsAnalytics(id)

        res.status(200).json({
            success: true,
            message: "successfully get instructor data",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getStudentAnalytics = async(req, res, next) =>{
    try {
        const id = req.user._id
        const result = await getstudentstat(id)
        res.status(200).json({
        success: true,
        message: "successfull get student statistics",
        data: result
     })
    } catch (error) {
        next(error)
    }
}

export const getCompanyAnalytics = async(req, res, next)=>{
    try {
        const result = await getrevenuestat()
        res.status(200).json({
          success: true,
          message: "successfull get reveanu statistics",
          data: result
        })
    } catch (error) {
        next(error)
    }
}


export const getCourseAnalytics = async(req, res, next)=>{
    try {
        const {id} = req.params
        const result = await getcoursestat(id)
        res.status(200).json({
        success: true,
        message: "successfull get course statistics",
        data: result})
    } catch (error) {
        next(error)
    }
}





export const getpaltformAnalyt = async (req, res, next)=>{
   try {
      const data = await getGlobalPlatformStats()

      res.status(201).json({
        status: "success",
        message: "successfully data fetched",
        data: data
      })
             
   } catch (error) {
    next(error)
   }
}



export const globalcomplition = async (req, res, next)=>{
    try {
        const rate = await getGlobalCompletionRate()
        res.status(201).json({
            status: "success",
            message: "successfully get complition rate",
            data: rate
        })
    } catch (error) {
        
    }
}