import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    const { taskId } = useParams()
    const [msg, setMsg] = useState(null)
    const [task, setTask] = useState(null)
    const [driver, setDriver] = useState(null)
    const [manager, setManager] = useState(null)
    const [truck, setTruck] = useState(null)

    useEffect(() => {
            if (!loading) {
                if (!user || user.role !== 'manager') {
                    navigate('/');
                } else {
                    getTask(taskId);
                }
            }
        }, [user, loading]);
    
        async function getDriverById(id){
            try {
                const res = await api.get(`workers/${id}`)
    
                setDriver(res.data)
                console.log(res.data)
    
            } catch (error) {
                console.log(error)
            }
        }

        async function getManagerById(id){
            try {
                const res = await api.get(`managers/${id}`)
        
                setManager(res.data)
                console.log(res.data)
        
            } catch (error) {
                setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
            }
        }

        async function getTruckById(id){
            try {

                const res = await api.get(`/trucks/${id}`)

                setTruck(res.data)

                console.log(res.data)

            } catch (error) {
                console.log(error)
            }
        }
    
        async function getTask(id){
            try {
                setMsg(null)
    
                if(!id){
                    setMsg('No ID!')
                    return
                }
    
                const res = await api.get(`tasks/${id}`)
    
                setTask(res.data)

                console.log(res.data)
    
                getDriverById(res.data.driver_id)
                getManagerById(res.data.manager_id)
                getTruckById(res.data.truck_id)
    
    
            } catch (error) {
                setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
            }
        }

    return(
        <>
            <div>
                {msg && <p>{msg}</p>}
            </div>

            {task && <div>
                <p>ID: {task.task_id}</p>
                <p>Start location: {task.start_location}</p>
                <p>End location: {task.end_location}</p>
                <p>Start time: {task.start_time}</p>
                <p>End time: {task.end_time ? task.end_time : 'Not finished yet!'}</p>
                <p>Driver: {driver?.first_name} {driver?.last_name} (Worker ID: {task.driver_id})</p>
                <p>Manager: {manager?.first_name} {manager?.last_name} (Manager ID: {task.manager_id})</p>
                <Link to={`/trucks/${task.truck_id}`} ><p>Truck: {truck?.truck_name} (ID: {task.truck_id}) </p></Link>
                <br></br>
                <p>Description:</p>
                <p>{task.description}</p>
            </div>}
        </>
    )
}