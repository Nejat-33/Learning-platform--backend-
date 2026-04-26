import Course from "../models/course.model.js"
import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"


export const createCourse = async (payload, user) =>{

  const creator = await User.findById(user)

  if(!creator) throw new Error('instuctor or admin is not found')
  if(creator.role != 'instructor' && creator.role != 'admin') throw new Error('the user is not instructor')

  const courseData = {...payload, createdBy: user}
  const course = await Course.create(courseData)
  return course
}

export const getallcourse = async ()=>{
    
    const course = await Course.find({isDeleted: false})
       .populate("createdBy", "name email")
       .sort({"title": 1})
    if(!course || course.length == 0) {
        throw new AppError('course not found')
    }
    return course
}


export const getcourse = async (id) =>{
    const course = await Course.findOne({_id: id})
    if(!course) throw new Error('the course is not found')
    return course
}


export const modifycourse = async(id, updatedData, userid)=>{
 
    const course = await Course.findOne({_id: id, isDeleted: false})
    
    if(!course) throw new AppError('canot get course', 404)
    
    if(course.createdBy.toString() !== userid.toString()){
        throw new AppError('you dont have permission to edit this')
    }

    const updatecourse = await Course.findByIdAndUpdate(id,
        {$set: updatedData},
        {new : true}
    )
    return updatecourse
}


export const deletecourse = async(id)=>{
    console.log("id in middle", id);
    
    const course = await Course.findById({_id: id, isDeleted: false})
    if(!course) {
        throw new AppError('course already deleted or not found')
    }
    course.isDeleted = true
    await course.save()
    return course
}

export const getnewCourse = async()=>{
    const course = await Course.find({
        status: "published"
    }).sort({createdAt: -1}).limit(5)
    console.log("course in the service: ", course);
    

    if(!course){
        throw new AppError("can not find course")
    }
    return course
}
