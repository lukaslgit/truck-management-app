import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx"

export default function(){
    const { workerId } = useParams()
    const { user, loading } = useAuth()
    const [worker, setWorker] = useState(null)

    const [truck, setTruck] = useState(null)

    useEffect(() => {
            if (!loading) {
                if (!user || user.role !== 'manager') {
                    navigate('/');
                } else {
                    getWorker(workerId);
                    hasTruck(workerId)
                }
            }
        }, [user, loading]); 

    async function getWorker(id) {
        try {
            const worker = await axios.get(`/workers/${id}`)

            setWorker(worker.data)

        } catch (error) {
            console.log(error)
        }
    }

    async function hasTruck(id) {
        try {
            const truck = await axios.get(`/workers/hastruck?workerId=${id}`)

            setTruck(truck.data)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
        
        {worker &&
        <div>
                <p>{worker.worker_id}</p>
                <p>{`${worker.first_name} ${worker.last_name}`}</p>
        </div>}
        {truck ?
        <div>
                <Link to={`/trucks/${truck.truck_id}`}>{`( ID: ${truck.truck_id} ) ${truck.truck_name}`}</Link>
        </div> :
        <div>
            <p>Worker has no truck!</p>
        </div>
        }
        </>
    )
}