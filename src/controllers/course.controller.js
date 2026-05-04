import { createCourse , deletecourse, getallcourse, getcourse,getcoursedashboard,getnewCourse, getsinglecoursedetail, modifycourse} from "../services/courseservice.js"
import { createbatch } from "../services/batch.service.js"
import mongoose from "mongoose"
import Course from "../models/course.model.js"
import User from "../models/user.model.js"
import Batch from "../models/batch.model.js"


export const createcourse = async(req, res, next)=>{
    
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {title, description, durationInWeeks, passingScore, batchName,
             price, startDate, endDate, maxStudent, batch_format, instructor } = req.body

        const coursePayload = {title, description, durationInWeeks, passingScore}

        const existingCourse = await Course.findOne({ title }).session(session);
        if (existingCourse) {
            return res.status(400).json({ success: false, message: 'Course already exists.' });
        }

        const existingInstructor = await User.findById(instructor).session(session);
        if (!existingInstructor) {
            return res.status(400).json({ success: false, message: 'Assigned instructor not found.' });
        }

        const new_course = await createCourse(coursePayload, req.user._id)
        await new_course.save({session})

         const batchpayload = {course: new_course._id,batchName, startDate, endDate, maxStudent, batch_format, price, instructor}

         const batch = await createbatch(batchpayload, req.user._id)

         await batch.save({session})

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
        success: true,
        message: 'course and batch created successfully',
        data: new_course
    })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
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


export const getCourseDashboardData = async (req, res, next) => {
    try {
      const data = await getcoursedashboard()

      res.status(200).json({
        success: true,
        data: data
      })
    }
    catch(error) {
      next(error)
    }
};

export const getCourseAggregatedStats = async (req, res) => {
    const { courseId } = req.params;
    try {
        const stats = await Batch.aggregate([
            { 
                $match: { 
                    course: new mongoose.Types.ObjectId(courseId),
                    isDeleted: false 
                } 
            },
            {
                $group: {
                    _id: "$course",
                    totalBatches: { $sum: 1 },
                    totalStudentsEnrolled: { $sum: "$currentStudent" },
                    totalGraduates: { 
                        $sum: { $size: {
                            $ifNull: ["$graduates", []]
                        }
                    } 
                    }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.status(404).json({ message: "No batches found for this course" });
        }

        res.status(200).json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getbatchesinsingleC = async(req, res, next)=>{
    try {
        const {id} = req.params
        const data = await getsinglecoursedetail(id)
        
        res.status(200).json({
            sucess: true,
            data: data
        })
    } catch (error) {
        next(error)
    }
}