import mongoose from "mongoose";
require('dotenv').config()

const dbUrl = process.env.DB_URL!

const dbConnection = async () => {
    try {
        const data: any = await mongoose.connect(dbUrl)
        console.log(`Database is connected with ${data.connection.host}`)
    } catch (error: any) {
        console.log(error)
        setTimeout(dbConnection, 5000)
    }
}

export default dbConnection