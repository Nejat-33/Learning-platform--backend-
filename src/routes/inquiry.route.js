import express from 'express';
import { AnswerInquiry, createInquiry, getAllInquiries, getInquiryStats, getNewInquiries} from '../controllers/inquiry.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import rolevalidate from '../middlewares/role.middleware.js';

const Inqrouter = express.Router();


Inqrouter.post('/', createInquiry);
Inqrouter.get('/getall', authenticate, rolevalidate('admin'), getAllInquiries);
Inqrouter.get('/new', authenticate, rolevalidate('admin'), getNewInquiries)
Inqrouter.patch('/answer/:inquiryId', authenticate, rolevalidate('admin'), AnswerInquiry)
Inqrouter.get('/getInquiryStat', authenticate, rolevalidate('admin'), getInquiryStats)

export default Inqrouter;