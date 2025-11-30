import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    const { truckId } = useParams()
    const [msg, setMsg] = useState(null)
    const [truck, setTruck] = useState(null)
    const [driver, setDriver] = useState(null)
    const [manager, setManager] = useState(null)

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/');
            } else {
                getTruck(truckId);
            }
        }
    }, [user, loading]);

    async function getDriverById(id) {
        try {
            const res = await api.get(`workers/${id}`)

            setDriver(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    async function getManagerById(id) {
        try {
            const res = await api.get(`managers/${id}`)

            setManager(res.data)

        } catch (error) {
            setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
        }
    }

    async function getTruck(id){
        try {
            setMsg(null)

            if(!id){
                setMsg('No ID!')
                return
            }

            const res = await api.get(`trucks/${id}`)

            if(res.data.driver_id != user.worker_id && user.role != 'manager'){
                navigate('/')
            }

            setTruck(res.data)

            getDriverById(res.data.driver_id)
            getManagerById(res.data.manager_id)



        } catch (error) {
            setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
        }
    }

    return(
        <div>
            {msg && <p>{msg}</p>}
            
            <>
                
                {truck && 
                <div>
                    <p>ID: {truck.truck_id}</p>
                    <p>NAME: {truck.truck_name}</p>
                    <p>VIN: {truck.vin_number}</p>
                    <p>PLATE: {truck.license_plate}</p>
                    <p>DRIVER: {driver ? `${driver.first_name} ${driver.last_name} (ID: ${driver.worker_id})` : 'No driver yet!'}</p>
                    <p>MANAGER: {manager ? `${manager.first_name} ${manager.last_name} (ID: ${manager.manager_id})` : 'No manager yet!'}</p>
                </div>}
            </>
        </div>
    )
}