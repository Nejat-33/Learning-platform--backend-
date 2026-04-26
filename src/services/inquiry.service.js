import Inquiry from '../models/inquiry.model.js';
import AppError from '../utils/customerror.handler.js';

export const saveInquiry = async (inquiryData) => {
    if (!inquiryData.email || !inquiryData.message) {
        throw new AppError('Email and message are required fields', 400);
    }

    const newInquiry = await Inquiry.create(inquiryData);
    
    return newInquiry;
};

export const fetchAllInquiries = async () => {
    return await Inquiry.find().sort({ createdAt: -1 });
};

export const fetchNewinqury = async ()=>{
    return await Inquiry.find({status: "New"}).sort({createdAt : -1})
}


export const answerinquiry = async(id,responseMessage, userid)=>{
    const inquiry = await Inquiry.findByIdAndUpdate(
        id,
        {
            adminResponse: responseMessage,
            status: 'responded',
            respondedAt: new Date(),
            respondedBy: userid
        },
        { new: true }
    )
    return inquiry

}