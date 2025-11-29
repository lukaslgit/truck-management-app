import express from 'express'
const router = express.Router()
import { auth } from '../middlewares/auth.js'
import { pool } from '../db/db.js'

router.post('/register', auth, async (req, res) => {

    const { truck_name, vin_number, license_plate, driver_id } = req.body

    try {
        if(req.user.role != 'manager'){
            res.status(400).json({'error': "Only manager can register new truck!"})
            return
        }

        const manager_id = req.user.manager_id

        if(!truck_name || !vin_number || !license_plate || !driver_id || !manager_id){
            res.status(400).json({'error': 'All fields must be filled!'})
            return
        }

        const vinExist = await pool.query('SELECT COUNT(*) FROM trucks WHERE vin_number = $1', [vin_number])

        if(vinExist.rows[0].count > 0){
            res.status(400).json({'error': 'Truck with this VIN already exist in the database!'})
            return
        }

        const newTruck = await pool.query('INSERT INTO trucks (truck_name, vin_number, license_plate, driver_id, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING truck_name', [truck_name, vin_number, license_plate, driver_id, manager_id])

        res.status(200).json({'message': `${newTruck.rows[0].truck_name} was registered!`})

    } catch (error) {
        res.status(400).json({'error': 'Something went wrong, please try again later!'})   
    }
})

export default router