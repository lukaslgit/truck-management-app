import express from 'express'
const router = express.Router()
import bcrypt from 'bcrypt'
import { pool } from '../db/db.js'

// Register new worker
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, manager_id } = req.body

        if (!first_name || !last_name || !email || !password) {
            res.status(400).json({'error': 'All fields must be filled!'})
            return
        }

        const emailExist = await pool.query('SELECT COUNT(*) FROM workers WHERE email = $1', [email])

        if (emailExist.rows[0].count > 0) {
            res.status(400).json({'error': 'Email is already in use!'})
            return
        }

        const hashPassword = await bcrypt.hash(password, 10)
        
        const newUser = await pool.query('INSERT INTO workers (first_name, last_name, email, password, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING first_name, last_name, email, manager_id', [first_name, last_name, email, hashPassword, manager_id])

        res.json(newUser.rows[0])
    } catch (error) {
        res.status(500).json({'error': 'Unable to register new user!'})
    }
})


export default router;