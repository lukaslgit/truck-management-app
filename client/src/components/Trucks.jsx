import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()

    const { user, loading } = useAuth()

    const [trucks, setTrucks] = useState([])

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
        <>
            <div>
                <div>SEARCHBAR</div>
                <div><Link to={'/trucks/register'}>ADD NEW TRUCK</Link></div>
            </div>
            <div>
                {trucks && <div>
                    <ul className="flex gap-10">
                        {trucks.map(truck => 
                        <li key={truck.truck_id}>
                            <Link to={`/trucks/${truck.truck_id}`}>
                                <p>(ID: {truck.truck_id}) {truck.truck_name}</p>
                                <p>{truck.license_plate}</p>
                            </Link>
                        </li>)}
                    </ul>
                </div>}
            </div>
        </>
    )
}