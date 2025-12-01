import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()

    const { user, loading } = useAuth()

    const [trucks, setTrucks] = useState([])
    const [searchTruck, setSearchTruck] = useState('')

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'manager') {
                navigate('/');
            } else {
                getAllTrucks();
            }
        }
    }, [user, loading]);

    async function getAllTrucks(){
        try {
            const res = await api.get('/trucks')
            setTrucks(res.data)
        } catch (error) {
            console.log('Server error!')
        }
    }

    
    return(
        <div className="flex justify-center min-h-screen items-start pt-20">
        <div className="bg-sky-100 p-8 rounded-xl w-full max-w-3xl space-y-6">

            <div className="flex justify-between items-center">
            <div>
                <input
                value={searchTruck}
                onChange={e => setSearchTruck(e.target.value)}
                type="text"
                placeholder="Search trucks..."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
            </div>
            <div>
                <Link
                to={'/trucks/register'}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >ADD NEW TRUCK</Link>
            </div>
            </div>

            {trucks && (
            <ul className="space-y-4">
                {trucks.map(truck => (
                <li
                    key={truck.truck_id}
                    className="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow"
                >
                    <Link to={`/trucks/${truck.truck_id}`} className="block space-y-1">
                    <p><span className="font-semibold">ID:</span> {truck.truck_id}</p>
                    <p><span className="font-semibold">Name:</span> {truck.truck_name}</p>
                    <p><span className="font-semibold">License Plate:</span> {truck.license_plate}</p>
                    <p className="text-blue-500 font-medium">See more details...</p>
                    </Link>
                </li>
                ))}
            </ul>
            )}

        </div>
        </div>

    )
}