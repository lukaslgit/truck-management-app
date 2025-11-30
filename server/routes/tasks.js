import express from 'express'
const router = express.Router()
import { auth } from '../middlewares/auth.js'
import { pool } from '../db/db.js'

router.post('/register', auth, async (req, res) => {
    
    const { description, start_location, end_location, driver_id, truck_id } = req.body
    
    try {
        if(req.user.role != 'manager'){
            res.status(400).json({'error': "Only manager can register new task!"})
            return
        }

        if(!description || !start_location || !end_location || !driver_id || !truck_id){
            res.status(400).json({'error': 'All fields must be filled!'})
            return
        }

        const time = await pool.query('SELECT NOW()')

        const start_time = time.rows[0].now
        const manager_id = req.user.manager_id

        const newTask = await pool.query('INSERT INTO tasks (description, start_location, end_location, start_time, driver_id, truck_id, manager_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING description', [description, start_location, end_location, start_time, driver_id, truck_id, manager_id])

        res.status(200).json({'message': `Task '${newTask.rows[0].description}' was added!`})

    } catch (error) {
        console.log(error)
        res.status(400).json({'error': 'Something went wrong, please try again later.'})
    }
})

export default router