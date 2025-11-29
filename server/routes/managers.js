import express from 'express'
const router = express.Router()
import bcrypt from 'bcrypt'
import { pool } from '../db/db.js'
import jwt from 'jsonwebtoken'

// MANAGER REGISTER
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

// MANAGER LOGIN
router.post('/login', async (req, res) => {
    const {email, password} = req.body
    try {
        if(!email || !password){
            res.status(400).json({'error': 'All fields must be filled!'})
            return
        }

        const user = await pool.query('SELECT manager_id, first_name, email, password FROM managers WHERE email = $1', [email])

        if(user.rows.length == 0){
            res.status(400).json({'error': 'User does not exist'})
            return
        }

        const matchPass = await bcrypt.compare(password, user.rows[0].password)

        if(!matchPass){
            res.status(400).json({'error': 'Wrong password!'})
            return
        }

        const token = jwt.sign({'manager_id': user.rows[0].manager_id, 'name': user.rows[0].first_name, 'email': user.rows[0].email, 'role': 'manager'}, process.env.SECRET, {
            expiresIn: '5m'
        })

        res.cookie('token', token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 5 * 60 * 1000
            })

        res.status(200).json({'message': 'Logged in!'})
    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later!'})
    }
})

export default router