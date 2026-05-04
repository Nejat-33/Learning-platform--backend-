import Course from "../models/course.model.js"
import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"
import Batch from "../models/batch.model.js"


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

    const user = await User.findOne({id: userid})
    
    if(course.createdBy.toString() !== userid.toString()){
        throw new AppError('you dont have permission to edit this')
    }

    const allowedUpdates = ['title', 'description', 'passingScore', 'image', 'durationInWeeks'];
    const updates = Object.keys(updatedData);
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        throw new AppError("Invalid updates provided", 400);
    }

    const updatedcourse = await Course.findOneAndUpdate(
        { _id: id, isDeleted: false },
        updatedData,
        { 
            new: true,           
            runValidators: true  
        }
    );
    return updatedcourse
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
    

    if(!course){
        throw new AppError("can not find course")
    }
    return course
}


export const getcoursedashboard = async()=>{
     const totalCourses = await Course.countDocuments({ isDeleted: false });
        
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newCourses = await Course.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
            isDeleted: false
        });

        const allBatches = await Batch.find({ isDeleted: false });
        const completedBatches = allBatches.filter(b => b.status === 'completed').length;
        const totalBatchesCount = allBatches.length;
        const completionRate = totalBatchesCount > 0 
            ? Math.round((completedBatches / totalBatchesCount) * 100) 
            : 0;

        const courses = await Course.find({ isDeleted: false }).lean();

        const coursesWithStats = await Promise.all(courses.map(async (course) => {
            const batches = await Batch.find({ course: course._id, isDeleted: false });
            
            const totalStudents = batches.reduce((sum, batch) => sum + (batch.currentStudent || 0), 0);
            const activeBatches = batches.filter(b => b.status === 'active' || b.status === 'ongoing').length;

            return {
                ...course,
                totalStudents,
                activeBatchesCount: activeBatches,
            };
        }));

        const data = {
                stats: {
                    totalCourses,
                    newCourses,
                    completionRate
                },
                courses: coursesWithStats
            }

        return data
}


export const getsinglecoursedetail = async (id)=>{
    const course = await Course.findOne({_id: id, isDeleted: false})

    if(!course){
        throw new AppError("can not get course", 404)
    }
    
    const batch = await Batch.find({course: course._id}).populate('instructor', 'firstname lastname email ')

    const totalbatch = batch.length

    const instructorMap = new Map()

    batch.forEach(batch => {
        if (batch.instructor) {
            instructorMap.set(batch.instructor._id.toString(), batch.instructor);
        }
    });
    
    const instructorsList = Array.from(instructorMap.values());
    
    const data = {
        courses: course,
        batches: batch,
        totalBatches: totalbatch,
        instructors: instructorsList 
    };
    
  return data 
}
