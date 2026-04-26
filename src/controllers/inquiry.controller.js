import * as inquiryService from '../services/inquiry.service.js';
import { answerinquiry } from '../services/inquiry.service.js';
import Inquiry from '../models/inquiry.model.js';

export const createInquiry = async (req, res, next) => {
    try {
        const inquiry = await inquiryService.saveInquiry(req.body);

        res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully. We will contact you soon!",
            data: inquiry
        });
    } catch (error) {
        next(error); 
    }
}
    
export const getAllInquiries = async (req, res, next) => {
    try {
        const inquiries = await inquiryService.fetchAllInquiries();
        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        next(error);
    }
}

export const getNewInquiries = async (req, res, next) => {
    try {
        const inquiries = await inquiryService.fetchNewinqury();
        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        next(error);
    }
}

export const AnswerInquiry = async (req, res) => {
    const { inquiryId } = req.params;
    const { responseMessage } = req.body;

    const inquiry = await answerinquiry(inquiryId, responseMessage, req.user._id)
    
    res.status(200).json({ status: 'success', data: inquiry });
};

export const getInquiryStats = async (req, res) => {
  const stats = await Inquiry.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        responded: [
          { $match: { status: "responded" } },
          { $count: "count" }
        ],
        pending: [
          { $match: { status: "pending" } },
          { $count: "count" }
        ],
        bySubject: [
          { $group: { _id: "$subject", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);
const subjects = stats[0].bySubject || [];
  res.status(200).json({
    status: 'success',
    data: {
      total: stats[0].total[0]?.count || 0,
      pending: stats[0].pending[0]?.count || 0,
      responded: stats[0].responded[0]?.count || 0,
      subject: subjects.length > 0 ? subjects[0]._id : "None",
      // Full breakdown for charts/lists
      subjectBreakdown: subjects
    }
  });
};