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
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-sky-100 p-8 rounded-xl w-full max-w-md">

                <div className="mb-6 text-center">
                    <h2 className="font-bold text-2xl text-gray-800 mb-4">Register New Truck</h2>
                </div>

                {msg && (
                    <p className="mb-4 text-center text-red-500 font-medium">
                        {msg}
                    </p>
                )}

                <form onSubmit={handleRegister} className="space-y-4">

                    <div>
                        <label className="block mb-1 font-medium">Truck Name</label>
                        <input
                            type="text"
                            placeholder="Truck name"
                            value={truckName}
                            onChange={e => setTruckName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md 
                                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">VIN Number</label>
                        <input
                            type="text"
                            placeholder="VIN number"
                            value={vinNumber}
                            onChange={e => setVinNumber(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md 
                                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">License Plate</label>
                        <input
                            type="text"
                            placeholder="License plate"
                            value={licensePlate}
                            onChange={e => setLicensePlate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md 
                                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Driver ID</label>
                        <input
                            type="number"
                            min={0}
                            placeholder="Driver ID"
                            value={driverId}
                            onChange={e => setDriverId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md 
                                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                                py-2 px-4 rounded-md transition-colors"
                    >
                        Register Truck
                    </button>
                </form>

            </div>
        </div>
    )
}