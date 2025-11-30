import express from 'express'
const router = express.Router()
import { auth } from '../middlewares/auth.js'
import { pool } from '../db/db.js'

//Register new task
router.post('/register', auth, async (req, res) => {
    const { description, start_location, end_location, driver_id } = req.body
    
    try {
        if(req.user.role != 'manager'){
            res.status(400).json({'error': "Only manager can register new task!"})
            return
        }

        if(!description || !start_location || !end_location || !driver_id){
            res.status(400).json({'error': 'All fields must be filled!'})
            return
        }

        const truck_id_data = await pool.query('SELECT truck_id FROM trucks WHERE driver_id = $1', [driver_id])

        if(truck_id_data.rows.length === 0){
            res.status(400).json({'error': `Driver with ID ${driver_id} does not have truck!`})
            return
        }

        const truck_id = truck_id_data.rows[0].truck_id

        const time = await pool.query('SELECT NOW()')

        const start_time = time.rows[0].now
        const manager_id = req.user.manager_id

        const newTask = await pool.query('INSERT INTO tasks (description, start_location, end_location, start_time, driver_id, truck_id, manager_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING description', [description, start_location, end_location, start_time, driver_id, truck_id, manager_id])

        res.status(200).json({'message': `Task '${newTask.rows[0].description}' was added!`})

    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later.'})
    }
})

//Get all tasks
router.get('/', async (req, res) => {

    const { finished, id } = req.query

    try {
        
        const data = await pool.query(`SELECT * FROM tasks WHERE finished = $1 ${ id ? 'AND driver_id = $2' : ''} ORDER BY task_id`, id ? [finished, id] : [finished])
        res.status(200).json(data.rows)
    } catch (error) {
        console.log(error)
    }
})

//Get task by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const data = await pool.query('SELECT * FROM tasks WHERE task_id = $1', [id])

        if(data.rows.length === 0){
            res.status(400).json({'error': `Task with id ${id} does not exist!`})
            return
        }

        res.status(200).json(data.rows[0])

    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later!'})
    }
})

// Set task status to finished
router.post('/end/:id', auth, async (req, res) => {
    
    const { id } = req.params
    try {

        const driverMatch = await pool.query('SELECT driver_id FROM trucks WHERE truck_id = $1', [id])

        if(req.user.role != 'manager' && req.user.worker_id != driverMatch.rows[0]?.driver_id){
            res.status(400).json({'error': 'Only manager or tasks truck driver can finish the task!'})
            return
        }

        const updatedTask = await pool.query('UPDATE tasks SET finished = true, end_time = NOW() WHERE task_id = $1 RETURNING task_id', [id])

        res.status(200).json({'message': `Task with id: ${updatedTask.rows[0].task_id} was updated!`})
    } catch (error) {
        console.log(error)
    }
})

// Set task status to NOT finished
router.post('/reopen/:id', auth, async (req, res) => {
    
    const { id } = req.params
    try {

        const driverMatch = await pool.query('SELECT driver_id FROM trucks WHERE truck_id = $1', [id])

        if(req.user.role != 'manager' && req.user.worker_id != driverMatch.rows[0].driver_id){
            res.status(400).json({'error': 'Only manager can update this task!'})
            return
        }

        const updatedTask = await pool.query('UPDATE tasks SET finished = false, end_time = NULL WHERE task_id = $1 RETURNING task_id', [id])

        res.status(200).json({'message': `Task with id: ${updatedTask.rows[0].task_id} was updated!`})
    } catch (error) {
        console.log(error)
    }
})

export default router