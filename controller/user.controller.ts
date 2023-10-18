import { Request, Response, NextFunction } from 'express';
import userModel from '../Models/user.model';
import { sendToken } from './../utilities/jwt';

interface registrationData{
    name: string
    email: string
    password: string
}

export const registration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body as registrationData;
        
        const isEmailExist = await userModel.findOne({ email })
        if (isEmailExist) {
            return next(new Error('Email already exists'));
        }

        await userModel.create({
            name,
            email,
            password,
        })

        res.status(201).json({
            success: true,
        })

    } catch (error:any) {
        return next(error);        
    }
}

interface LoginRequestInterface {
    email: string,
    password: string
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
   try {
        const { email, password } = req.body as LoginRequestInterface
        
        if (!email || !password) return next(new Error("Please enter email and password"))
        
        const user = await userModel.findOne({ email }).select("+password")
        
        if (!user) return next(new Error("Invalid email or password"))
        
        const isPasswordMatch = await user.comparePassword(password)

        if (!isPasswordMatch) return next(new Error("Invalid email or password"))

        sendToken(user, 200, res)

    } catch (error: any) {
        return next(new Error(error.message))
    }
}