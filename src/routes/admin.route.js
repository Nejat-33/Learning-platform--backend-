import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import rolevalidate from '../middlewares/role.middleware.js';
import { getPendingInstructors, approveInstructor } from '../controllers/admin.controller.js';


const adminrouter = express.Router();

adminrouter.get('/pending-instructors', authenticate, rolevalidate('admin'), getPendingInstructors);
adminrouter.patch('/approve-instructor/:id', authenticate, rolevalidate('admin'), approveInstructor);

export default adminrouter;