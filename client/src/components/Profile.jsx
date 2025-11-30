import { useAuth } from "../context/AuthContext.jsx"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()
    const {user, loading} = useAuth()

    const [currentTasks, setCurrentTasks] = useState([])

    useEffect(() => {
        if (!loading){
            if(!user){
                navigate('/login')
            }else{
                console.log(user)
                if (user.role == 'worker'){
                    console.log(user.worker_id)
                    workersTasks(user.worker_id)
                }
            }
        }
    },[user, loading])


    async function workersTasks(id){

        try {
            const res = await api.get(`/tasks?finished=false&id=${id}`)
            setCurrentTasks(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    if(loading){
        return(
            <>LOADING...</>
        )
    }
    
    return(
        <>
        {user &&
        
        <div>
            <br></br>
            <section>
                <h2>{user.first_name} {user.last_name}</h2>
            </section>

            <section>
                <p>{user.role === 'manager' ? `MANAGER ID: ${user.manager_id}` : `WORKER ID: ${user.worker_id}`}</p>
                <p>Email: {user.email}</p>
            </section>

            <section>
                {currentTasks && 
                <div>
                    <br></br>
                    <h2>Your Tasks:</h2>
                    <ul className="flex gap-15">
                        {currentTasks.map(task => 
                        <li key={task.task_id}>
                            <Link to={`/tasks/${task.task_id}`}>
                            <p>{task.start_time}</p>
                            <p>FROM: {task.start_location}</p>
                            <p>TO: {task.end_location}</p>
                            <p>See more details...</p>
                            </Link>
                        </li>)}
                    </ul>
                </div>
                }
            </section>
        </div>
        }
        </>

    )
}