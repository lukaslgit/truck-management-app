import express, { json } from 'express';
import dotenv from 'dotenv';

import { pool } from './db/db.js';

const app = express()

app.use(json())
dotenv.config()

const PORT = process.env.PORT

// TEST
app.get('/', async (req, res) => {

    const testConnection = await pool.query('SELECT NOW()')

    if (testConnection.rows[0].now.length === 0){
        res.status(500).json({'error': 'Unable to connect to Database'})
        return
    }

    const time = testConnection.rows[0].now

    res.json({'message': `Connection to DB successful, time now: ${time}`})
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})