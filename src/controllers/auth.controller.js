import User from "../models/user.model.js";
import AppError from "../utils/customerror.handler.js";
import { createSendtoken, signAcessToken, signrefeashtoken } from "../utils/jwt.js";


export const googleAuthCallback = async (req, res) => {
    try {
        const user = req.user;

        const accessToken = signAcessToken(user._id);
        const refreshToken = signrefeashtoken(user._id);

        /* const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production'
        };

        res.cookie('refreshToken', refreshToken, cookieOptions);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        
        res.redirect(`${frontendUrl}/auth-success?token=${accessToken}`); */

        res.status(200).json({
            success: true,
            message: "Google OAuth is WORKING!",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.firstname
            }
        });

    } catch (error) {
        console.error("Callback Error:", error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/login?error=auth_failed`);
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