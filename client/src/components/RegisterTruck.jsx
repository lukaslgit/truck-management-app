import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'
import { useState } from "react"

export default function(){

    const { user, loading } = useAuth()
    const navigate = useNavigate()

    const [truckName, setTruckName] = useState('')
    const [vinNumber, setVinNumber] = useState('')
    const [licensePlate, setLicensePlate] = useState('')
    const [driverId, setDriverId] = useState('')

    const [msg, setMsg] = useState(null);

    useEffect(() => {
        if (!user && !loading){
            navigate('/')
        }

        if (user?.role != 'manager' && !loading){
            navigate('/')
        }
    },[user, loading])

    async function handleRegister(e){
        e.preventDefault()

        try {

            setMsg(null)
            
            if(!truckName || !vinNumber || !licensePlate || !driverId){
                setMsg('All fields must be filled!')
                return
            }

            const res = await api.post('/trucks/register', {'truck_name': truckName, 'vin_number': vinNumber, 'license_plate': licensePlate, 'driver_id': Number(driverId)})

            setTruckName('')
            setVinNumber('')
            setLicensePlate('')
            setDriverId('')

            setMsg(res.data.message)

        } catch (error) {
            setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
        }
    }

    return(
        <div>
            {msg && <p>{msg}</p>}
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="truck_name" value={truckName} onChange={e => setTruckName(e.target.value)}></input>
                <input type="text" placeholder="vin_number" value={vinNumber} onChange={e => setVinNumber(e.target.value)}></input>
                <input type="text" placeholder="license_plate" value={licensePlate} onChange={e => setLicensePlate(e.target.value)}></input>
                <input type="number" min={0} placeholder="driver_id" value={driverId} onChange={e => setDriverId(e.target.value)}></input>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}