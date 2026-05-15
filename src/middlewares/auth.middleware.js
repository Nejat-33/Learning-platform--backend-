import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"
import jwt from 'jsonwebtoken'
import { createSendtoken, signAcessToken } from "../utils/jwt.js"
import { OAuth2Client } from "google-auth-library"




export const authenticate = async(req, res ,next )=>{
    try {
        const header = req.header('authorization')
        if(!header || !header.startsWith('Bearer')){
            return next(new AppError('unauthorize user', 401))
        }

        const token  = header.split(' ')[1]

       const decodedUser = jwt.verify(token,process.env.JWT_ACCESS_SECRET_KEY)
      const {id} = decodedUser
      console.log(id);
      
      const user = await User.findById(id).select('-password')

      if(!user){
        return next(new AppError('user no longer exist', 401))
      }
      req.user = user
      next()
      
    } catch (error) {
        console.log("JWT Verify Error:", error.message);
        next(new AppError('invalid token please login again', 401))
    }
}




export const refreash = async(req, res, next)=>{
    try {
        const token = req.cookie.refreash
        if(!token) throw new AppError('there is now any refreash token', 401)

        const use = jwt.verify(token, process.env.REFREASH_SECRET_TOKEN)
        const user = await User.findById(use._id)
        if(!user) throw new AppError('user no loger exist', 401)
        
        const newAcessToken = signAcessToken(user._id)
        res.status(200).json({
            sucess: true,
            accessToken: newAcessToken
        })
    } catch (error) {
        next(new AppError('invalid refresh token', 403))
    }
}




export const login = async(req, res, next)=>{
    const {email,  password} = req.body
    if(!email || !password) {
        return next(new AppError('provide your email and password', 400))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new AppError('incorrect email', 401))
    }
    const isMatch = await user.comparePassword(password)

    if(!isMatch) {
        return next(new AppError('invalid password', 401))
    }
    await createSendtoken(user, 200, res)
}





const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    console.log("Body received:", req.body);
    try{
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

   const { 
            given_name, 
            family_name, 
            email, 
            picture, 
            sub: googleId
        } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            googleId: googleId,  
                provider: 'google',   
                firstname: given_name,
                lastname: family_name,
                email: email,
                profileImage: picture,
        });
    }

    createSendtoken(user, 200, res);
} catch (error) {
    console.error("Google Auth Error:", error);
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Google Token'
        });
}
};


// export const logout = async (req , res, next)=>{
//     res.cookie('refreash token','logout', {
//         expires: new Date(0),
//         secure: process.env.NODE_ENV == 'production',
//         sameSite: 'None',
//         httpOnly: true
//     })
//     res.status(200).json({
//         success: true,
//         message: 'successfully logout'
//     })
// }
export const logout = async (req, res, next) => {
    try {
        // Clear the refresh token cookie by setting its expiration to the past
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false, // match your development setup
            sameSite: 'lax'
        });
        
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};