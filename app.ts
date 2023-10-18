import express, {Request, Response, NextFunction} from 'express'
import cookieParser from 'cookie-parser'

export const app = express()
app.use(express.json())
app.use(cookieParser())

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
        success: true,
        message: "Hello root"
    })
})