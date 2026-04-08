import { createCourse , deletecourse, getallcourse, getcourse,getnewCourse, modifycourse} from "../services/courseservice.js"


export const createcourse = async(req, res, next)=>{
    try {
         const result = await createCourse(req.body, req.user._id)
    res.status(201).json({
        success: true,
        message: 'course created successfully',
        data: result
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
        console.log("id ", id);
    
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