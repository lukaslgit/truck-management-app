import { useEffect, useState } from "react"
import truckbg from '../../assets/truckbg.jpg'
import { Link } from "react-router-dom"
import api from '../../api/axios.js'

export default function({ user }){

    const [currentTasks, setCurrentTasks] = useState([])
    const [finishedTasks, setFinishedTasks] = useState([])

    useEffect(() => {
        console.log(user)
        workersTasks(user.worker_id)
    }, [user])


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

    return(
        <>
        
            <section className="bg-white">
                <div className="w-full h-80 bg-center" style={{ backgroundImage: `url(${truckbg})` }}></div>
                <div className="w-10/12 h-50 flex m-auto">
                <div className="flex justify-center gap-5">
                    <div className="w-fit h-full flex justify-center items-center">
                        <div
                            className="rounded-full h-48 w-48 bg-center bg-cover border-6 border-sky-50 shadow-2xl -translate-y-1/4"
                                style={{ backgroundImage: `url(${truckbg})` }}
                        ></div>
                    </div>
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-2xl font-black mb-2">{user.first_name} {user.last_name} [Driver]</h1>
                        <p className="text-gray-700">{user.email}</p>
                        <p className="text-gray-500">Phone number social links etc. [WIP]</p>
                    </div>
                </div>
                </div>
            </section>
            <section className="w-full bg-gray-100">
                <div className="w-10/12 m-auto flex">
                    <div className="w-1/4 h-100">
                        <p>phone number</p>
                        <p>email</p>
                        <button>CHAT</button>
                        <p>[WIP]</p>
                    </div>
                    <div className="w-3/4 h-100">
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
                                        <p>{new Date(task.start_time).toLocaleString('en-EN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
                </div>
            </section>

        </>
        
    )
    
}