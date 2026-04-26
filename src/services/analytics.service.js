import Analytics from "../models/analyticscache.js"
import Batch from "../models/batch.model.js"
import Course from "../models/course.model.js"
import Enrollment from "../models/enrollment.model.js"
import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"


export const updateCompletionAnalytics = async(courseid, batchid, studentid)=>{
      const course = await Course.findById(courseid)
      if(!course) throw new AppError('course doesnt exist', 404)

      const batch = await Batch.findById(batchid).populate("instructor")
      const instructor = batch.instructor

      await Analytics.findOneAndUpdate(
        {type: 'student', period: 'overall', student: studentid},
        {$inc: {totalCompletions: 1}},
        {upsert: true, new: true}
      )

      await Analytics.findOneAndUpdate(
        {type: 'course', period: 'overall', course: courseid},
        {$inc: {totalCompleted: 1}},
        {upsert: true, new: true}
      )

     await Analytics.findOneAndUpdate(
        {type: 'instructor', period: 'overall', instructor: instructor._id},
        {$inc: {totalCompletedStudent: 1}},
        {upsert: true, new: true}
      )
}


export const updateRvenuAnalytics = async(courseid, batchid, amount)=>{

      const course = await Course.findById(courseid)
      if(!course) throw new AppError('course doesnt exisit', 404)

      const batch = await Batch.findById(batchid).populate("instructor")
      const instructor = batch.instructor

      await Analytics.findOneAndUpdate(
        {type: 'course', course: courseid, period: 'overall'},
        {$inc: {totalRevenue: amount}},
        {upsert: true, new: true}
      ),

      await Analytics.findOneAndUpdate(
        {type: 'instructor', instructor: instructor._id, period: 'overall'},
        {$inc: {totalRevenue: amount}},
        {upsert: true, new: true}
      ),

      await Analytics.findOneAndUpdate(
        {type: 'company',period: 'overall'},
        {$inc: {totalRevenue: amount}},
        {upsert: true, new: true}
      )
}



export const updateEnrollmentAnalytics = async(courseid, batchid, studentid)=>{
    const course = await Course.findById(courseid)
    if(!course) throw new AppError('course doesnt exist', 404)

    const batch = await Batch.findById(batchid).populate("instructor")

    const instructor = batch.instructor

      await Analytics.findOneAndUpdate(
        {type: 'course', period: 'overall', course: courseid},
        {$inc: {totalEnrollment: 1}},
        {upsert: true, new : true})
        
      await Analytics.findOneAndUpdate(
        {type:'instructor', period: "overall", instructor: instructor._id},
        {$inc: {totalStudent: 1}},
        {upsert: true, new: true}
      )

      await Analytics.findOneAndUpdate(
        {type: 'student', student: studentid, period: 'overall'},
        {$inc : {courseEnrolled: 1}},
        {upsert: true, new: true}
      )
    }


 export const updateAttendenceAnalytics = async(enrollmentid)=>{
    const enrollment = await Enrollment.findById(enrollmentid).populate({path: 'batch', populate: [{path: 'course'}, {path: 'instructor'}]}).populate('student')
    if(!enrollment) throw new AppError('enrollment doesnt exist', 404)

 const courseid = enrollment.batch?.course?._id;
    const instructorid = enrollment.batch?.instructor?._id;
    const studentid = enrollment.student?._id;
    const period = 'overall'

    await Analytics.findOneAndUpdate(
        {type: 'course', course: courseid, period},
        {$inc: {totalAttendence: 1, }},
        {upsert: true, new: true}
    )
    await Analytics.findOneAndUpdate(
        {type: 'instructor', instructor: instructorid, period: "overall"},
        {$inc: {totalStudentAttended:1}},
        {upsert: true, new: true}
    )
    await Analytics.findOneAndUpdate(
        {type: 'student', student: studentid, period: 'overall'},
        {$inc: {sessionAttended:1}},
        {upsert: true, new: true}
    )
}

export const updateSessionAnalytics = async(batchid)=>{
   const batch = await Batch.findById(batchid).populate("course").populate("instructor")
   if(!batch) throw new AppError('batch donot exist', 404)
    
   const courseid = batch.course._id
   const instructorid = batch.instructor._id


    await Analytics.findOneAndUpdate(
        {type: 'course', course: courseid, period: 'overall'},
        {$inc: {totalSession: 1}},
        {upsert: true, new: true}
    )

    await Analytics.findOneAndUpdate(
        {type: 'instructor', instructor: instructorid},
        {$inc: {totalSessionConducted: 1}},
        {upsert: true, new: true}
    )
}


export const getinstructorinfo = async(id)=>{
  const user = await User.findOne(id)
  
  if(!user) throw new AppError('instructor is not found')
  const stat = await Analytics.find({
   type: 'instructor',
   instructor: id,
   period: "overall"}).select('totalSessionConducted totalAttendence totalStudentAttended totalStudent totalRevenue')

   if(!stat) throw new AppError('no stat for this instructor')

    return stat
}

export const getselectedInsAnalytics = async(id)=>{
    const batch = await Batch.findOne({_id: id})
    if(!batch) throw new AppError("batch is not found ", 404)
    const instructor = batch.instructor

    const stat = await Analytics.find({
      type: "instructor",
      instructor,
      period: "overall",
    }).select("totalSessionConducted totalAttendence totalStudentAttended totalStudent")
    
    if(!stat) throw new AppError("no stat for this user")
      return stat
}

export const getstudentstat = async(id)=>{
  
  const student= await User.findOne(id)
   if(!student) throw new AppError('student is not found', 404)

   const stat = await Analytics.findOne({type: 'student', student: id, period: "overall"})
   .select('sessionAttended courseEnrolled completionRate period student');
   if(!stat){
    throw new AppError("can not get student analytics data")
   }

    return stat
}

export const getrevenuestat = async()=>{
  const stat = await Analytics.find({
    type: 'company',
    period: 'overall'
  }).select('')

  if(!stat) throw new AppError('no stat for this company')
  return stat
}

export const getGlobalCompletionRate = async () => {
  const result = await Analytics.aggregate([

    { $match: { type: 'course', period: 'overall' } },

    {
      $group: {
        _id: null,
        allCompletions: { $sum: "$totalCompleted" },
        allEnrollments: { $sum: "$totalEnrollment" }
      }
    },
    {
      $project: {
        _id: 0,
        percentage: {
          $cond: [
            { $gt: ["$allEnrollments", 0] },
            { 
              $multiply: [
                { $divide: ["$allCompletions", "$allEnrollments"] }, 
                100 
              ] 
            },
            0 
          ]
        }
      }
    }
  ]);


  return result.length > 0 ? Math.round(result[0].percentage) : 0;
};



export const getcoursestat = async(id)=>{
  const course = await Course.findOne({_id:id})

  if(!course) throw new AppError('course is not found')

  const stat = await Analytics.find({
   type: 'course',
    course: id,
    period: 'overall'}).select('totalCompleted totalRevenue totalEnrollment totalSession')

  if(!stat) throw new AppError("there is no stat for the this course", 404)
 
  

    return stat
}

export const getGlobalPlatformStats = async () => {

    const totalCourses = await Course.countDocuments({ 
        status: 'published', 
        isDeleted: false 
    });

    const totalStudents = await User.countDocuments({ 
        role: 'student'
    });

    const totalInstructors = await User.countDocuments({ 
        role: 'instructor'
    });

    const companyStats = await Analytics.findOne({ 
        type: 'company', 
        period: 'overall' 
    }).select('totalRevenue totalCompletions');

    const complitionrate = await getGlobalCompletionRate()

    if(!complitionrate){
      throw new AppError("error happen in the rate fetching", 404)
    }

    return {
        courses: totalCourses || 0,
        students: totalStudents || 0,
        instructors: totalInstructors || 0,
        revenue: companyStats?.totalRevenue || 0,
        ComplitionRate: complitionrate
    };
};

