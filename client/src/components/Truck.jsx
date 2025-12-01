import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate, Link } from "react-router-dom"
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
            navigate('/trucks')
        }
    }

    return(
<div className="flex justify-center min-h-screen items-start pt-20">
  <div className="bg-sky-100 p-8 rounded-xl w-full max-w-3xl space-y-6">

    {msg && (
      <div className="bg-blue-100 border border-blue-300 text-blue-700 p-3 rounded-md">
        {msg}
      </div>
    )}

    {truck && (
      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <p><span className="font-semibold">ID:</span> {truck.truck_id}</p>
        <p><span className="font-semibold">Name:</span> {truck.truck_name}</p>
        <p><span className="font-semibold">VIN:</span> {truck.vin_number}</p>
        <p><span className="font-semibold">License Plate:</span> {truck.license_plate}</p>

        <p>
          <span className="font-semibold">Driver:</span>{" "}
          {driver ? `${driver.first_name} ${driver.last_name} (ID: ${driver.worker_id})` : 'No driver yet!'}
        </p>

        <p>
          <span className="font-semibold">Manager:</span>{" "}
          {manager ? `${manager.first_name} ${manager.last_name} (ID: ${manager.manager_id})` : 'No manager yet!'}
        </p>

        {user.role == 'manager' && <Link to="/trucks" className="text-blue-600 hover:underline font-medium">Back to all trucks</Link>}

      </div>
    )}

  </div>
</div>


    )
}