import {Response} from 'express'
import { IUser } from '../Models/user.model'
require('dotenv').config()

interface TokenOptionsInterface{
    expires: Date
    maxAge: number
    httpOnly: boolean
    sameSite: 'lax' | 'strict' | 'none' | undefined
}

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10)
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10)

export const accessTokenOptions: TokenOptionsInterface = {
        expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), 
        maxAge: accessTokenExpire * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
}

export const refreshTokenOptions: TokenOptionsInterface = {
        expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), 
        maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
}

export const sendToken = (user: IUser, statusCode: number, response: Response) => {
    const accessToken = user.signAccessToken()
    const refreshToken = user.signRefreshToken()

    response.cookie('access_token', accessToken, accessTokenOptions)
    response.cookie('refresh_token', refreshToken, refreshTokenOptions)

    response.status(statusCode).json({
        success: true,
        user,
        accessToken,
    })

}