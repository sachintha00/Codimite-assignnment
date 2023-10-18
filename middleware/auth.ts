import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken'
import userModel, { IUser } from "../Models/user.model";
require('dotenv').config()

declare module 'express' {
  interface Request {
    user?: IUser;
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const access_token = req.cookies.access_token;

        if (!access_token) {
            return next(new Error("Please login to access this resource"));
        }

        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

        if (!decoded) {
            return next(new Error("Access token is not valid"));
        }

        const user = await userModel.findOne({ _id: decoded.id });

        if (!user) {
            return next(new Error("User not found"));
        }

        req.user = user;
        next();
    } catch (error: any) {
        return next(new Error(error.message))
    }
}