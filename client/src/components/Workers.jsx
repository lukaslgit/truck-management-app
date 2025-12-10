import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()

    const { user, loading } = useAuth()

    const [workers, setWorkers] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'manager') {
                navigate('/');
            } else {
                setSearch('')
            }
        }
    }, [user, loading]);


    useEffect(() => {
        if(search.length > 2){
            handleSearch()
        }

        if(search.length === 0){
            getAllUsers()
        }
    }, [search])

    async function getAllUsers(){
        try {
            const res = await api.get('/workers')
            const workersData = await attachTrucks(res.data)
            setWorkers(workersData)
        } catch (error) {
            console.log('Server error!')
        }
    }

    async function attachTrucks(workers) {
    return await Promise.all(
        workers.map(async worker => {
        try {
            const truckRes = await api.get(`/workers/hastruck?workerId=${worker.worker_id}`)

            return {
            ...worker,
            truck: truckRes.data
            }
        } catch {
            return { ...worker, truck: null }
        }
        })
    )
    }

    async function handleSearch(){
            if(!search || search.length < 2){
                return
            }
    
            try {
                const res = await api.get(`/workers/search?text=${search}`)
    
                const workersData = await attachTrucks(res.data)
                setWorkers(workersData)
            } catch (error) {
                console.log(error)
            }
        }


        return(
        <div className="flex justify-center min-h-screen items-start pt-20">
        <div className="bg-sky-100 p-8 rounded-xl w-full max-w-3xl space-y-6">

            <div className="flex justify-between items-center">
            <div>
                <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search workers..."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
            </div>
            </div>

            {workers && (
            <ul className="space-y-4">
                {workers.map(worker => (
                <li
                    key={worker.worker_id}
                    className="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow"
                >
                    <Link to={`/workers/${worker.worker_id}`} className="block space-y-1">
                    <p><span className="font-semibold">ID:</span> {worker.worker_id}</p>
                    <p><span className="font-semibold">Name:</span> {worker.first_name + ' ' + worker.last_name}</p>
                    <p><span className="font-semibold">Truck:</span> {worker.truck ? worker.truck?.truck_name : 'No truck!'}</p>
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