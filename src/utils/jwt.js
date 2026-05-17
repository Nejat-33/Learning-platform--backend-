import jwt from 'jsonwebtoken'
import { now } from 'mongoose'

 export const signAcessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_ACCESS_SECRET_KEY, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE_DATE
    })
}

export const signrefeashtoken = (id) => {
    return jwt.sign({id}, process.env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE_DATE
    })
}

export const createSendtoken = (user, statuscode, res)=>{
    const accessToken = signAcessToken(user._id)
    const refreshToken = signrefeashtoken(user._id)

    const cookieOption = {
        expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None'
    }
    res.cookie('refresh', refreshToken, cookieOption)

    user.password = undefined

    res.status(statuscode).json({
         status: "success",
         message: "Authentication successful",
         accessToken,
         refreshToken,
         user,
         hasCompletedOnboarding: user.hasCompletedOnboarding
    })

} 