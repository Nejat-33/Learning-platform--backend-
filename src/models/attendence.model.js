import mongoose from 'mongoose'

const AttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    status:{
        type: String,
        enum: ['present', 'absent'],
        required: true
    },
    markedAt: {
       type: Date,
       default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, {timestamps: true})


AttendanceSchema.index(
  { batch: 1, student: 1, date: 1 },
  { unique: true }
);

const Attendence = mongoose.model('Attendence', AttendanceSchema)

export default Attendence