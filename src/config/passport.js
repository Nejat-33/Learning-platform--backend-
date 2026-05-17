import passport from "passport";
import dotenv from 'dotenv'
dotenv.config()
import { Strategy as GoogleStrategy} from 'passport-google-oauth20'
import User from "../models/user.model.js";



passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        passReqToCallback: true
    }, async(req, accessToken, refeashToken, profile, done)=>{
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            const email = profile.emails[0].value;
            user = await User.findOne({ email });

            if (user) {
                user.googleId = profile.id;
                user.provider = 'google';
                user.isVerified = true;
                await user.save();
                return done(null, user);
            }

            const newUser = await User.create({
    firstname: profile.name?.givenName || profile.displayName.split(' ')[0],
    lastname: profile.name?.familyName || profile.displayName.split(' ')[1] || ' ',
    email: email,
    googleId: profile.id,
    provider: 'google',
    isVerified: true,
    password: undefined,
    passwordConfirm: undefined,
    role: 'pending'  
});

            return done(null, newUser);
                
        } catch (error) {
            console.error("GOOGLE AUTH ERROR:", error);
            return done(error, null)
        }
    })
)