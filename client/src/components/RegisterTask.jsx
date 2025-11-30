import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    const [msg, setMsg] = useState(null)

    const [description, setDescription] = useState('')
    const [startLocation, setStartLocation] = useState('')
    const [endLocation, setEndLocation] = useState('')
    const [driverId, setDriverId] = useState('')

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'manager') {
                navigate('/');
            }
        }
    }, [user, loading])

    async function handleRegisterTask(e){

        e.preventDefault()

        try {
            setMsg(null)
            if(!description || !startLocation || !endLocation || !driverId){
                setMsg('All fields must be filled!')
                return
            }

            const res = await api.post('/tasks/register', {'description': description, 'start_location': startLocation, 'end_location': endLocation, 'driver_id': driverId})

            setDescription('')
            setStartLocation('')
            setEndLocation('')
            setDriverId('')

            setMsg(res.data.message)

        } catch (error) {
            console.log(error)
            setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
        }
    }

    return(
        <>
            <form onSubmit={handleRegisterTask}>
                <input placeholder='description' value={description} onChange={e => setDescription(e.target.value)}></input>
                <input placeholder='start_location' value={startLocation} onChange={e => setStartLocation(e.target.value)}></input>
                <input placeholder='end_location' value={endLocation} onChange={e => setEndLocation(e.target.value)}></input>
                <input placeholder='driver_id' value={driverId} onChange={e => setDriverId(e.target.value)}></input>
                <button type='submit'>Add Task</button>
            </form>
            {msg && <p>{msg}</p>}
        </>
    )
}