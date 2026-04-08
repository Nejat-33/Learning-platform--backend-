import User from "../models/user.model.js"
import AppError from "../utils/customerror.handler.js"



/* export const resetpassword = async(useremail, protocol, )=>{
   const user = await User.findOne({email: useremail})
   if(user){
    throw new AppError("user is not found", 404)
   }
   if(user.provider == 'google'){
    throw new AppError("the provider is google")
   }

   const newpassTo = user.createpasswordResetToken()
   await user.save({ validateBeforeSave: false })

const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${newpassTo}`;

  return resetURL
   
} */

  export const changepassword = async(id,oldpassword, password, passwordConfirm)=>{
    const user = await User.findById(id).select("+password")
    const passwordcheck = await user.comparePassword(oldpassword)
    
    if(!passwordcheck){
     throw new AppError("your current password is wrong")
    }

    user.password = password
    user.passwordConfirm = passwordConfirm
    await user.save()
   
    return user
  }