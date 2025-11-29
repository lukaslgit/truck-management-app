import express, { json } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { pool } from './db/db.js';

//Routes
import tests from './routes/test.js'
import workers from './routes/workers.js'
import managers from './routes/managers.js'

const app = express()

app.use(json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

dotenv.config()


const PORT = process.env.PORT

// TEST ROUTES
app.use('/api/tests', tests)

// WORKERS ROUTES
app.use('/api/workers', workers)

// MANAGERS ROUTES

app.use('/api/managers', managers)


app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})