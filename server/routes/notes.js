import express from 'express'
const router = express.Router()
import { auth } from '../middlewares/auth.js'
import { pool } from '../db/db.js'

// Get notes from task id
router.get('/:task_id', auth, async (req, res) => {
    const { task_id } =  req.params

    try {

        const taskExist = await pool.query('SELECT task_id FROM tasks WHERE task_id = $1', [task_id])

        if(taskExist.rows.length === 0 ){
            res.status(400).json({'error': 'Task does not exist!'})
            return
        }

        const worker_id = req.user?.worker_id || null

        const ownerCheck = await pool.query('SELECT driver_id FROM tasks WHERE driver_id = $1', [worker_id])

        if(ownerCheck.rows.length === 0 && req.user.role != 'manager'){
            res.status(400).json({'error': 'Only driver of the task or manager can view this notes!'})
            return
        }

        const data = await pool.query('SELECT * FROM notes WHERE task_id = $1 ORDER BY note_id DESC', [task_id])

        res.status(200).json(data.rows)

    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later!'})
        return
    }
})

// Register new note
router.post('/register', auth, async (req, res) => {

    const { note_text, task_id, worker_id, manager_id } = req.body

    try {

        const ownerCheck = await pool.query('SELECT driver_id FROM tasks WHERE driver_id = $1', [worker_id])

        if(ownerCheck.rows.length === 0 && req.user.role != 'manager'){
            res.status(400).json({'error': 'Only driver of the task or manager can add notes!'})
            return
        }

        if(!note_text || !task_id){
            res.status(400).json({'error': 'All fields must be filled!'})
            return
        }

        if(!worker_id && !manager_id){
            res.status(400).json({'error': 'Either worker id or manager id must be provided!'})
            return
        }

        if(!manager_id){
            await pool.query('INSERT INTO notes (note_text, task_id, worker_id) VALUES ($1, $2, $3)', [note_text, task_id, worker_id])
            res.status(200).json({'message': 'Note was added!'})
            return
        } else {
                await pool.query('INSERT INTO notes (note_text, task_id, manager_id) VALUES ($1, $2, $3)', [note_text, task_id, manager_id])
                res.status(200).json({'message': 'Note was added'})
                return
            }
    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later!'})
        return
    }
})

export default router