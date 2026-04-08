import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    // either batch or course
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: string,
        enum: ['video', 'documnent', 'quiz', 'link', 'pdf'],
        required: true
    },
    externalLink:{
        type: String
    },
    duration: {
        type: Number,
    },
    order: {
        type: Number,
        required: true
},
    fileUrl: {
        type: String
    },
      isPublished: {
    type: Boolean,
    default: false,
  },
    releaseDate: {
        type: Date
    }

}, {timestamps: true})


const Material = mongoose.model('Material', materialSchema)

export default Material