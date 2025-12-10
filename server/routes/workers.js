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

            const userData = await pool.query('SELECT worker_id, first_name, last_name, email, password FROM workers WHERE email = $1', [email])

            const hashPassword = userData.rows[0].password

            const passMatch = await bcrypt.compare(password, hashPassword)

            if (!passMatch) {
                res.status(400).json({'error': 'Wrong password!'})
                return
            }

            const token = jwt.sign({'worker_id': userData.rows[0].worker_id, 'first_name': userData.rows[0].first_name, 'last_name': userData.rows[0].last_name, 'email': userData.rows[0].email, 'role': 'worker'}, process.env.SECRET, {
                expiresIn: '30m'
            })

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "strict",
                maxAge: 30 * 60 * 1000
            })
            res.status(200).json({'message': 'Logged in'})

    } catch (error) {
        console.log(error)
        res.status(500).json({'error': "Something went wrong, please try again!"})
    }
})

// Check if worker is logged in
router.get('/me', auth, (req, res) => {
    res.json({ user: req.user })
})

// Worker logout
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token', {maxAge: 1})
        res.status(200).json({'message': 'Log out!'})
    } catch (error) {
        console.log(error)
    }
})


// Search for workers
router.get('/search', auth, async (req, res) => {
    const { text } = req.query

    try {
        if(req.user.role != 'manager'){
            res.status(400).json({'error': 'Only managers can search for workers!'})
            return
        }

        const data = await pool.query(`SELECT * FROM workers WHERE (first_name || ' ' || last_name) ILIKE $1`, [`%${text.trim().replace(/\s+/g, ' ')}%`])


        res.status(200).json(data.rows)

    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later!'})
    }
})

// Has the worker truck
router.get('/hastruck', auth, async (req, res) => {
    const { workerId } = req.query

    try {
        const hasTruck = await pool.query('SELECT COUNT(*) FROM trucks WHERE driver_id = $1', [workerId])


        if (hasTruck.rows[0].count == 0){
            res.status(200).json(null)
            return
        }

        const truckId = await pool.query('SELECT truck_id, truck_name FROM trucks WHERE driver_id = $1', [workerId])

        res.status(200).json(truckId.rows[0])
    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later!'})
    }
})

// Get worker by id
router.get('/:id', auth, async (req, res) => {

    const { id } = req.params

    try {
        if (!id){
            res.status(400).json({'error': 'No id!'})
            return
        }

        const user = await pool.query('SELECT worker_id, first_name, last_name FROM workers WHERE worker_id = $1', [id])

        if(user.rows.length === 0){
            res.status(400).json({'error': 'Worker does not exist!'})
            return
        }

        res.status(200).json(user.rows[0])
    } catch (error) {
        res.status(400).json({'error': 'Something went wrong!'})
    }
})

// Get all workers
router.get('/', auth, async (req, res) => {
    try {
        const workers_data = await pool.query('SELECT worker_id, first_name, last_name FROM workers')
        res.status(200).json(workers_data.rows)
    } catch (error) {
        res.status(400).json({'error': 'Something went wrong!'})
    }
})

export default router;