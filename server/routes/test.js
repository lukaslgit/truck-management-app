import express from 'express'
const router = express.Router()
import { pool } from '../db/db.js'

// Verify connection to the database
router.get('/', async (req, res) => {

    try {
        const testConnection = await pool.query('SELECT NOW()')

        if (testConnection.rows[0].now.length === 0){
            res.status(400).json({'error': 'Unable to connect to Database'})
            return
        }
        const time = testConnection.rows[0].now
        
        res.json({'message': `Connection to DB successful, time now: ${time}`})
    } catch (error) {
        res.status(400).json({'error': 'Unable to connect to Database'})
    }
})

export default router