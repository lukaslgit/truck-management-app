import { useAuth } from "../context/AuthContext.jsx"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()
    const {user, loading} = useAuth()

    const [currentTasks, setCurrentTasks] = useState([])
    const [finishedTasks, setFinishedTasks] = useState([])

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
            const resC = await api.get(`/tasks?finished=false&id=${id}`)
            setCurrentTasks(resC.data)
            const resF = await api.get(`/tasks?finished=true&id=${id}`)
            setFinishedTasks(resF.data)
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
        
        <div className="p-5">
            <section >
                <h2 className="text-xl"><span className="font-bold">Hello </span>{user.first_name}!</h2>
            </section>

            <section className="my-4 p-2 bg-blue-100 rounded-md w-fit">
                <p className="font-bold">{user.first_name} {user.last_name}</p>
                <p className="px-2">Role: {user.role === 'manager' ? 'Manager' : 'Worker'}</p>
                <p className="px-2">{user.role === 'manager' ? `ID: ${user.manager_id}` : `ID: ${user.worker_id}`}</p>
                <p className="px-2">Email: {user.email}</p>
            </section>

            <section className="py-5">
                {currentTasks.length == 0 && finishedTasks == 0 &&<div><h2 className="font-bold">You have no tasks!</h2></div>}
                {currentTasks.length == 0 && <div><h2 className="font-bold">You have no current tasks!</h2></div>}
                {currentTasks.length > 0 && 
                <div>
                    <br></br>
                    <h2 className="font-bold">Your Current Tasks:</h2>
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
                </div>}
                {finishedTasks.length > 0 &&
                <div className="my-5">
                    <h2 className="font-bold">Your finished tasks:</h2>
                    <ul className="flex gap-15">
                        {finishedTasks.map(task => 
                        <li key={task.task_id}>
                            <Link to={`/tasks/${task.task_id}`}>
                            <p>Start time: {new Date(task.start_time).toLocaleString('en-EN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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