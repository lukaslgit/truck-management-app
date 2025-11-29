import express from 'express'
const router = express.Router()
import bcrypt from 'bcrypt'
import { pool } from '../db/db.js'

router.post('/register', async (req, res) => {
    const {first_name, last_name, email, password, key} = req.body
    const managerSecretKey = 123456 // TODO ADD REAL KEY TO ENV OR TO DATABASE
    try {
        if (!first_name || !last_name || !email || !password || !key){
            res.status(400).json({'error': 'All fields must be filled!'})
            return
        }

        if(key != managerSecretKey){
            res.status(400).json({'error': 'Invalid KEY!'})
            return
        }

        const emailExist = await pool.query('SELECT COUNT(*) FROM managers WHERE email = $1', [email])

        if(emailExist.rows[0].count > 0){
            res.status(400).json({'error': 'User already exists!'})
            return
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const data = await pool.query('INSERT INTO managers (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING first_name', [first_name, last_name, email, hashPassword])

        res.status(200).json({'message': `Manager ${data.rows[0].first_name} has been registered!`})

    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later!'})
    }

})

export default router