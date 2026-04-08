import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true,
        required: true,
    },
    batch : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'batch',
        index:true,
        required: true
    },
    enrollmentDate : {
        type: Date,
        default: Date.now
    },
    status : {
        type: String,
        enum: ['active', 'completed', 'dropped', 'suspended'],
        default: 'active',
        index: true
    },
    finalGrade: {
        type: Number,
        min: 0,
        max: 4
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid","failed" ],
        default: "pending"
    },

    attendencePercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    certificateIssued: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
})


// this code is compound unique index used to prevent one student to donot enroll in the same batch twice
EnrollmentSchema.index({ student: 1, batch: 1 }, { unique: true });

const Enrollment = mongoose.model('enrollment', EnrollmentSchema)

export default Enrollment