import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    instructor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true
    },
    batchName: {
      type: String,
      required: true,
      trim: true,
    },
    
    startDate: {
       type: Date,
       required: true,
       index: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    schedule: {
        type: [
            {
                type: String,
                enum: [
                    'Monday',
                    'Tuesday',
                    "Wednesday",
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ]
            }
        ],
        time: String,
    },
    maxStudent: {
       type: Number,
       required: true,
       min: 1
    },
    currentStudent: {
        type: Number,
        default: 0
    },
    status: {
       type: String,
       enum: ['upcoming', 'ongoing', 'completed', "cancelled"],
       default: "upcoming",
       index: true
    },
    room: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'A course must have a price'],
        min : 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    }
}, {timestamps: true})


const Batch = mongoose.model('batch', BatchSchema)

export default Batch