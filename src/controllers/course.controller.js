import { createCourse , deletecourse, getallcourse, getcourse,getnewCourse, modifycourse} from "../services/courseservice.js"
import { createbatch } from "../services/batch.service.js"


export const createcourse = async(req, res, next)=>{
    try {
        const {title, description, durationInWeeks, passingScore, batchName, price, startDate, endDate, maxStudent, batch_format} = req.body
        const coursePayload = {title, description, durationInWeeks, passingScore}

        const new_course = await createCourse(coursePayload, req.user._id)

         const batchpayload = {course: new_course._id,batchName, startDate, endDate, maxStudent, batch_format, price}

         const batch = await createbatch(batchpayload, req.user._id)

    res.status(201).json({
        success: true,
        message: 'course and batch created successfully',
        data: new_course
    })
    } catch (error) {
        next(error)
    }  
}

export const getallCourse  = async(req, res, next) =>{
    try{
    const course = await getallcourse()

    res.status(200).json({
        success: true,
        message: 'sucessfully get the course',
        data: course
    })
    } catch(error){
      next(error)
    }
}

export const modifyCourse = async (req, res, next)=>{
    try {
        const {id} = req.params
    
        const result = await modifycourse(id, req.body, req.user._id)

        res.status(200).json({
            success: true,
            message: "course modified sucessfully",
            data: result
        })
        
    } catch (error) {
        next(error)
    }
}


export const deleteCourse = async (req, res, next) =>{
    try {
        const {id} = req.params
        const result = await deletecourse(id)

         res.status(200).json({
            success: true,
            message: "course deleted sucessfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}


export const getCourse = async(req, res, next) =>{
    try {
        const {id} = req.params
        const result = await getcourse(id)

        res.status(200).json({
            success: true,
            message: "course get sucessfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}


export const new_realease_courses = async(req, res, next)=>{

    try {
        const course = await getnewCourse();

        res.status(201).json({
            status: "success",
            results: course.length,
            data: {course}
        })
    } catch (error) {
        next(error)
    }
}