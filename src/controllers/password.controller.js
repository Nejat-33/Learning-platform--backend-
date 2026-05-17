import User from "../models/user.model.js";
import sendEmail from "../utils/email.js";
import crypto from 'crypto'
import { signAcessToken } from "../utils/jwt.js";
import { changepassword } from "../services/password.service.js";


export const forgotPassword = async (req, res, next) => {
    const {email} =  req.body
    const user = await User.findOne({ email});
    
    if (!user) return res.status(404).json({ message: "No user with this email." });

    if (user.provider === 'google') {
        return res.status(400).json({ message: "This account uses Google Login." });
    }

    const resetToken = user.createpasswordResetToken()
    await user.save({ validateBeforeSave: false });

    const resetURL = `http://localhost:5173/resetPassword/${resetToken}`;
const message = `Forgot your password?\n Reset it here:\n ${resetURL}.\n This link expires in 10 minutes`;
    try {
        await sendEmail({
            email: user.email,
      subject: 'Password Reset',
      message
        })
        res.status(200).json({
             satus: "sucess",
             message: "Token sent to email!"
         });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateBeforeSave: false });
         console.log('Full email error:', JSON.stringify(err, null, 2));
    console.log('Error message:', err.message);
    console.log('Error code:', err.code);
        res.status(500).json({ status: err, message: "email sending fail." });
    }
};


export const resetPassword = async (req, res) => {
    try{
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({status: 'fail',
             message:"Step 1 Fail: Token not found in DB. Check your hashing logic." });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    
    await user.save();
    const token = signAcessToken(user._id);
    res.status(200).json({ status: 'success', token });
} catch (err){
    console.error("RESET ERROR:", err);
        res.status(400).json({
            status: 'error',
            message: err.message || "Reset failed"
        });
}
};

export const changePassword = async(req, res, next)=>{
    try {
        const id = req.user._id
        const {oldpassword, password, passwordConfirm} = req.body
        const updatedData = await changepassword(id, oldpassword, password, passwordConfirm)
        
        const token = signAcessToken(id)
        
        res.status(200).json({
            success: true,
            message: "Password successfully changed",
            accessToken: token,
            data: updatedData
        })
    } catch (error) {
        next(error)
    }
}
