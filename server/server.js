import express, { json } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { pool } from './db/db.js';

//Routes
import tests from './routes/test.js'
import workers from './routes/workers.js'

const app = express()

app.use(json())
app.use(cookieParser())
dotenv.config()

const PORT = process.env.PORT

// TEST ROUTES
app.use('/api/tests', tests)

// WORKERS ROUTES
app.use('/api/workers', workers)


app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})