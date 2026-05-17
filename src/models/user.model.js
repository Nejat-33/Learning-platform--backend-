import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [function() { return !this.googleId; }, 'First name is required'],
        trim: true,
    },
    lastname: {
        type: String,
        required: [function() { return !this.googleId; }, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [function() { return !this.googleId; }, 'Email is required'],
        unique: true,
        lowecase:true,
        index: true,
        trim: true,
    },
    password: {
        type: String,
        required: [function() { return !this.googleId; }, 'Password is required'],
        trim: true,
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [function () { return this.provider === 'local' && !this.googleId; }],
        validate: {
            validator: function(el) {
                
                if (this.provider === 'local' && this.password) {
                    return el === this.password;
                }
                return true;
            },
            message: 'Passwords are not the same!'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'instructor', 'student', 'pending'],
        default: 'pending',
        index: true
    },
    isApproved: { 
        type: Boolean, 
        default: function() {

            return this.role !== 'instructor'; 
        }
    },
    phone: {
        type: String,
    },
    instructorProfile: {
    bio: { type: String, default: "" },
    specialty: { type: String, default: "" } ,
    experienceYears : {type: Number, default: 0}
    },
    profileImage:{
        type: String,
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    googleId: {
        type: String,
        select: false,
        unique: true,
        sparse: true
    },
    hasCompletedOnboarding: { 
        type: Boolean, 
        default: false // Every new user starts as false!
    },
    passwordResetToken: String,

    passwordResetExpire : Date,

    isActive: {
        type: Boolean,
        default: true
    }

}, {timestamps: true})



// this will hash any password enter in the database
UserSchema.pre('save', async function() {
    
    if( !this.password) return 
    if(!this.isModified('password')) return 

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    
})

// this will compare the enteres user password with the password in the database
UserSchema.methods.comparePassword = async function (enteredpassword){
    return await bcrypt.compare(enteredpassword, this.password)
}

UserSchema.methods.createpasswordResetToken = function(){
    const resettoken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resettoken)
        .digest('hex');
    
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000

    return resettoken
}

UserSchema.methods.toJSON = function(){
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}


const User = mongoose.model('Users', UserSchema)

export default User