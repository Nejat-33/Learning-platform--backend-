import mongoose from 'mongoose'

const AnalyticSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['student', 'course', 'instructor','company'],
        required: true
    },
    student: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    course: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    instructor: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    totalEnrollment: {
        type: Number,
        default: 0
    },
    totalStudent: {
        type: Number,
        default: 0
    },
    courseEnrolled: {
        type: Number,
        default: 0
    },
    totalSession:{
       type: Number,
       default: 0
    },
    totalAttendence: {
 type: Number,
       default: 0
    },
    sessionAttended:{
 type: Number,
       default: 0
    },
    totalSessionConducted: {
 type: Number,
       default: 0
    }, 
    totalStudentAttended: {
        type: Number,
        default: 0
    },
    completionRate: {
        type: Number,
        default: 0
    },
    totalCompletions: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    totalCompleted : {
        type: Number,
        default: 0
    },
    totalCompletedStudent:{
        type: Number,
        default: 0
    },
    averageAttendence:  {
       type: Number,
       default: 0
    },
    period: {
       type: String, 
       default: "overall",
    },
})

const Analytics = mongoose.model('analytics', AnalyticSchema)

export default Analytics