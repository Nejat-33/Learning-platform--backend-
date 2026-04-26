import mongoose from "mongoose";


const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: ['Infrastructure', 'Campus Life', 'Events', 'Academics', 'Faculty'],
    required: true 
  },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  url: { type: String, required: true },
  metadata: {
    statValue: { type: String },
    designation: { type: String }, 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Resource = mongoose.model('resourse', resourceSchema)

export default Resource