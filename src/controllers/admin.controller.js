import User from "../models/user.model.js";

export const getPendingInstructors = async (req, res, next) => {
    try {
        const pendingList = await User.find({ role: 'instructor', isApproved: false }).select('-password');
        
        res.status(200).json({
            success: true,
            results: pendingList.length,
            data: pendingList
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const approveInstructor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const approvedUser = await User.findByIdAndUpdate(
            id, 
            { isApproved: true }, 
            { new: true, runValidators: true }
        );

        if (!approvedUser) {
            return res.status(404).json({ success: false, message: "Instructor account profile record not found." });
        }

        res.status(200).json({
            success: true,
            message: `${approvedUser.firstname} has been verified and granted dashboard operational access.`,
            data: approvedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};