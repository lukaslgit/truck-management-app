import { Link } from "react-router-dom";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    const [tasks, setTasks] = useState([])
    const [finished, setFinished] = useState(false)

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'manager') {
                navigate('/');
            } else {
                getAllTasks()
            }
        }
    }, [user, loading, finished])

    async function getAllTasks(){
            try {
                const res = await api.get(`/tasks?finished=${finished}`)
                setTasks(res.data)
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }


    return(
        <>
        <div>
            <div>
            SEARCHBAR
            </div>
            <div>
                <Link to={'/tasks/register'}>CREATE NEW TASK</Link>
            </div>
        </div>

        <div>
            <button onClick={() => setFinished(!finished)}>{finished ? 'Current' : 'Finished'}</button>
            {tasks && 
            <ul className="flex gap-15">
                {tasks.map(task => 
                <li key={task.task_id}>
                    <Link to={`/tasks/${task.task_id}`} >
                    <p>ID: {task.task_id}</p>
                    <p>START: {task.start_location}</p>
                    <p>END: {task.end_location}</p>
                    <p>START: {task.start_time}</p>
                    <p>END: {task.end_time}</p>
                    {task.description ? <p>Desc: {task.description}</p> : <p>Desc: No description</p>}
                    </Link>
                </li>)}
            </ul>}
        </div>
        
        </>


    )
}