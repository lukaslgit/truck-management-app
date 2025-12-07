import express, { json } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//Routes
import tests from './routes/test.js'
import workers from './routes/workers.js'
import managers from './routes/managers.js'
import trucks from './routes/trucks.js'
import tasks from './routes/tasks.js'
import notes from './routes/notes.js'

const app = express()

app.use(json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.DOMAIN,
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

// TRUCKS ROUTES
app.use('/api/trucks', trucks)

//TASKS ROUTES
app.use('/api/tasks', tasks)

//NOTES ROUTES
app.use('/api/notes', notes)


app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})