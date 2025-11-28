import express, { json } from 'express';
import dotenv from 'dotenv';

const app = express()

app.use(json())
dotenv.config()

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send('Backend working!')
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})