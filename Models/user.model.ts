import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const emailRegexPattern: RegExp = /^[\w\.-]+@[\w\.-]+\.\w+$/

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>
    signAccessToken: () => string
    signRefreshToken: () => string
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        validate: (value: string) => {
            return emailRegexPattern.test(value)
        },
        message: 'Please enter valid email'
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    }
})

userSchema.pre<IUser>('save',async function (next){
    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.signAccessToken = function(){
    return jwt.sign({
        id: this._id
    }, process.env.ACCESS_TOKEN_SECRET!,
        {
        expiresIn: "5m"
    })
}

userSchema.methods.signRefreshToken = function(){
    return jwt.sign({
        id: this._id
    }, process.env.REFRESH_TOKEN_SECRET!,
    {expiresIn: "3d"})
}

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password)
}

const userModel: Model<IUser> = mongoose.model('User', userSchema)
export default userModel