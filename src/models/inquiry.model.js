import mongoose, { mongo } from "mongoose";


const inquirySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true }, 
    subject: { 
        type: String, 
        enum: ['Course Detail', 'Payment Issue', 'Partnership', 'Other'],
        default: 'Course Detail'
    },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'responded', 'ignored'], 
        default: 'pending' 
    },
    adminResponse: String, 
    respondedAt: Date,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Inquiry = mongoose.model('inquiry', inquirySchema)

export default Inquiry