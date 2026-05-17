import User from "../models/user.model.js";
import AppError from "../utils/customerror.handler.js";
import { createSendtoken, signAcessToken, signrefeashtoken } from "../utils/jwt.js";

export const googleAuthCallback = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ success: false, message: "Authentication failed" });
        }

        const accessToken = signAcessToken(user._id);
        const refreshToken = signrefeashtoken(user._id);

        res.cookie('refreshToken', refreshToken, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'Lax',
            secure: false
        });

        res.status(200).json({
            status: 'success',
            accessToken,
            user,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            requiresRoleSelection: user.role === 'pending'  // ← add this flag
        });
    } catch (error) {
        next(error);
    }
};
     


export const signup = async(req, res, next)=>{
   try {
      const {firstname,lastname, email, password, passwordConfirm, role, instructorProfile} = req.body
      const exist = await User.findOne({email})
      if(exist){
         throw new AppError("user is already registered", 400)
      }
      const newuser = await User.create({
          firstname,
          lastname,
          email,
          password,
          passwordConfirm,
          role,
          provider: 'local',
          instructorProfile: {
            bio: instructorProfile?.bio || "",
            specialty: instructorProfile?.specialty || ""
          }
      })
     await createSendtoken(newuser, 201, res)
   } catch (error) {
      next(error)
   }
}

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            // Send a clear, structural 404/401 code instead of an unhandled server 500 crash
            return res.status(404).json({
                success: false,
                message: "Profile registration completing. Please retry entry point access."
            });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const setUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['student', 'instructor'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role. Must be student or instructor.' });
        }

        if (req.user.role !== 'pending') {
            return res.status(400).json({ success: false, message: 'Role already assigned.' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { role },
            { new: true }
        );

        res.status(200).json({ success: true, data: { user } });
    } catch (err) {
        next(err);
    }
};