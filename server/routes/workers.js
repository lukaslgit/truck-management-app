import express from 'express'
const router = express.Router()
import bcrypt from 'bcrypt'
import { pool } from '../db/db.js'
import jwt from 'jsonwebtoken'
import { auth } from '../middlewares/auth.js'

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
        console.log(error)
        res.status(500).json({'error': 'Unable to register new user!'})
    }
})

// Worker login
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
            const emailExist = await pool.query('SELECT COUNT(*) FROM workers WHERE email = $1', [email])

            if (!email || !password){
                res.status(400).json({'error': 'All fields must be filled!'})
                return
            }

            if (emailExist.rows[0].count == 0){
                res.status(400).json({'error': 'User does not exist!'})
                return
            }

            const userData = await pool.query('SELECT worker_id, email, password FROM workers WHERE email = $1', [email])

            const hashPassword = userData.rows[0].password

            const passMatch = await bcrypt.compare(password, hashPassword)

            if (!passMatch) {
                res.status(400).json({'error': 'Wrong password!'})
                return
            }

            const token = jwt.sign({'worker_id': userData.rows[0].worker_id, 'email': userData.rows[0].email}, process.env.SECRET, {
                expiresIn: '5m'
            })

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 5 * 60 * 1000
            })
            res.status(200).json({'message': 'Logged in!'})

    } catch (error) {
        res.status(500).json({'error': "Something went wrong, please try again!"})
    }
})

// Check if worker is logged in
router.get('/me', auth, (req, res) => {
    res.json({ user: req.user })
})

export default router;