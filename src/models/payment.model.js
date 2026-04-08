import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    enrollment: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Enrollment'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['chapa', 'cash', 'manual'],
        required: true
    },
    tx_ref: {
        type: 'String',
        unique: true,
        sparse: true
    },
    status: {
        type : String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
        index: true
    },
    transactionId: {
      type: String
    },
    receiptNumber: {
        type: String ,
        sparse: true,
        unique: true
    },
    paidAt: Date,
    confirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    confirmedAt: Date,

    isDeleted:{
       type: Boolean,
       default: false,
       index: true,
    }
}, {timestamps: true})



const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;