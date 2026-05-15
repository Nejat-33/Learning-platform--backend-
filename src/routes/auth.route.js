import express from 'express'
import passport from 'passport'
import { authenticate, googleLogin, login, logout, refreash} from '../middlewares/auth.middleware.js'
import { signup } from '../controllers/auth.controller.js'
import { googleAuthCallback } from '../controllers/auth.controller.js'
import { changePassword, forgotPassword, resetPassword } from '../controllers/password.controller.js'
const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.post('/logout', logout)

authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    accessType: 'offline',
    prompt: 'select_account'
}))

authRouter.post('/google', googleLogin)
authRouter.get('/google/callback', (req, res, next) => {

    next();
}, passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login'
}), (req, res) => {

    googleAuthCallback(req, res);
});


authRouter.get('/me', authenticate, (req, res)=>{
    res.status(200).json({
        success: true,
        data: {user: req.user}
    })
})
authRouter.get('/test-forgot', (req, res) => res.send("Route is alive!"));
authRouter.patch('/forgotpassword', forgotPassword)
authRouter.patch('/changepassword', authenticate, changePassword)
authRouter.patch('/resetpassword/:token', resetPassword)
authRouter.post('/refresh', refreash)


export default authRouter