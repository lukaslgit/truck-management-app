import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    const { truckId } = useParams()
    const [msg, setMsg] = useState(null)
    const [truck, setTruck] = useState(null)

    useEffect(() => {
        if (!user && !loading){
            navigate('/')
        }

        if(user?.role == 'manager'){
            getTruck(truckId)
        }
        
    },[user, loading])

    async function getTruck(id){
        try {
            setMsg(null)

            if(!id){
                setMsg('No ID!')
                return
            }

            const res = await api.get(`trucks/${id}`)

            setTruck(res.data)

        } catch (error) {
            
        }
    }

    return(
        <div>
            {truck && 
            <>
                
                <div>
                    <Link to={'/trucks'}>BACK</Link>
                </div>

                <div>
                    <p>ID: {truck.truck_id}</p>
                    <p>NAME: {truck.truck_name}</p>
                    <p>VIN: {truck.vin_number}</p>
                    <p>PLATE: {truck.license_plate}</p>
                    <p>DRIVER: {truck.driver_id}</p>
                    <p>MANAGER: {truck.manager_id}</p>
                </div>
            </>}
        </div>
    )
}