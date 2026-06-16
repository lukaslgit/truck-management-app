import { useEffect, useState } from "react"
import truckbg from '../../assets/truckbg.jpg'
import { Link } from "react-router-dom"
import api from '../../api/axios.js'

export default function({ user }){

    const [currentTasks, setCurrentTasks] = useState([])
    const [finishedTasks, setFinishedTasks] = useState([])

    useEffect(() => {
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
                <div className="relative w-full h-60 sm:h-80 bg-center bg-cover" style={{ backgroundImage: `url(${truckbg})` }}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                </div>
                <div className="w-11/12 sm:w-10/12 m-auto flex">
                    <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 py-5 sm:py-0 sm:h-50">
                        <div className="flex justify-center items-center sm:items-start sm:-translate-y-1/4">
                            <div
                                className="rounded-full h-32 w-32 sm:h-48 sm:w-48 bg-center bg-cover border-6 border-sky-50 shadow-2xl"
                                    style={{ backgroundImage: `url(${truckbg})` }}
                            ></div>
                        </div>
                        <div className="flex flex-col justify-center text-center sm:text-left sm:pt-3">
                            <h1 className="text-xl sm:text-2xl font-black mb-2">{user.first_name} {user.last_name} [Driver]</h1>
                            <p className="text-gray-700">{user.email}</p>
                            <p className="text-gray-500">Phone number social links etc. [WIP]</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-gray-100 pb-10">
                <div className="w-11/12 sm:w-10/12 m-auto flex flex-col md:flex-row gap-6 md:gap-0">
                    <div className="w-full md:w-1/4 md:h-100 pb-4 md:pb-0">
                        <p>phone number</p>
                        <p>email</p>
                        <button>CHAT</button>
                        <p>[WIP]</p>
                    </div>
                    <div className="w-full md:w-3/4 md:h-100">
                        <section className="py-5">
                            {currentTasks.length == 0 && finishedTasks == 0 &&<div><h2 className="font-bold">You have no tasks!</h2></div>}
                            {currentTasks.length == 0 && <div><h2 className="font-bold">You have no current tasks!</h2></div>}
                            {currentTasks.length > 0 &&
                            <div>
                                <br></br>
                                <h2 className="font-bold">Your Current Tasks:</h2>
                                <ul className="flex flex-col sm:flex-row gap-5 sm:gap-15 flex-wrap mt-3">
                                    {currentTasks.map(task =>
                                    <li key={task.task_id} className="bg-white p-4 rounded-md shadow">
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
                                <ul className="flex flex-col sm:flex-row gap-5 sm:gap-15 flex-wrap mt-3">
                                    {finishedTasks.map(task =>
                                    <li key={task.task_id} className="bg-white p-4 rounded-md shadow">
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
