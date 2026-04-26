

import mongoose from "mongoose";
import slugify from "slugify";

const CourseSchema = new mongoose.Schema({

    title:{
        type: String,
       required: [true, 'A course must have a title'],
        trim: true,
       unique: true
    },
    description: {
        type: String,
       required: [true, 'A course must have a description'],
    },
    durationInWeeks: {
       type: Number,
       required: true,
       min: 1,
    },
    slug: String,
    
    hasPrerequisite: {
        type: Boolean,
        default: false,
    },
    prerequisiteDescription :{
      type: String,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
        index: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        
    },
    thumbnail: {
        type: String
    },
    passingScore: {
        type: Number,
        required: true
    },

    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    }
}, {timestamps: true})

CourseSchema.pre('save', async function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  
});

const Course = mongoose.model('Course', CourseSchema)

export default Course