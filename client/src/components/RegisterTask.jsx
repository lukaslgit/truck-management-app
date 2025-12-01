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
        <div className="flex items-center justify-center min-h-screen">
        <div className="bg-sky-100 p-8 rounded-xl w-full max-w-md">
            <div className="mb-6 text-center">
            <h2 className="font-bold text-2xl text-gray-800 mb-4">Add New Task</h2>
            </div>

            <form onSubmit={handleRegisterTask} className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Start Location</label>
                <input
                type="text"
                placeholder="Start location"
                value={startLocation}
                onChange={e => setStartLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">End Location</label>
                <input
                type="text"
                placeholder="End location"
                value={endLocation}
                onChange={e => setEndLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Driver ID</label>
                <input
                type="number"
                placeholder="Driver ID"
                value={driverId}
                onChange={e => setDriverId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                placeholder="Task description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                rows={4}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Add Task
            </button>
            </form>

            {msg && (
            <p className="mt-4 text-center text-red-500 font-medium">
                {msg}
            </p>
            )}
        </div>
        </div>

    )
}