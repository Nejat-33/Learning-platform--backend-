
import mongoose  from "mongoose";

const SessionSchema = new mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'batch',
        required: true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    qrCodeToken : {
        type: String,
        required: true,
        unique: true
    },
    lastRotaion :{
      type: Date,
      default: Date.now()
    },
    expirationDate: {
        type: Date,
        required : true
    }, 
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {timestamps: true})


const Session = mongoose.model('Session', SessionSchema)

export default Session