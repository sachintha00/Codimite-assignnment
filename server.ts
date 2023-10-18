import { app } from './app'
import dbConnection from './utilities/db';
require('dotenv').config()

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
    dbConnection()
})