import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx"

export default function(){
    const { workerId } = useParams()
    const { user, loading } = useAuth()
    const [worker, setWorker] = useState(null)

    const navigate = useNavigate()

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

    async function startChat(){
        try {

            const user1 = {user_id: user.role === 'manager' ? user.manager_id : user.worker_id, role: user.role}
            const user2 = {user_id: worker.worker_id, role: 'worker'}

            const res = await axios.post('chats/createChat', {
                user1: user1,
                user2: user2
            })

            console.log(res.data)

        } catch (error) {
            if(error.response.status === 409){
                {/* TODO: OPEN THE EXISTING CHAT */}
                console.log('Chat already exists!')
                return
            }
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

        <div>
            <button onClick={() => startChat()}>Start Chat!</button>
        </div>
        </>
    )
}