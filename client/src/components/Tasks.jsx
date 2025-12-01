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
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'manager') {
                navigate('/');
            } else {
                getAllTasks()
                setSearch('')
            }
        }
    }, [user, loading, finished])

    useEffect(() => {
        if(search.length > 3){
            handleSearch()
        }

        if(search.length === 0){
            getAllTasks()
        }
    }, [search])

    async function getAllTasks(){
        try {
            const res = await api.get(`/tasks?finished=${finished}`)
            setTasks(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSearch(){
        if(!search || search.length < 3){
            return
        }

        try {
            const res = await api.get(`http://localhost:8000/api/tasks/search?text=${search}&finished=${finished}`)

            setTasks(res.data)
        } catch (error) {
            console.log(error)
        }
    }




    return(
        <div className="flex justify-center min-h-screen items-start pt-20">
        <div className="bg-sky-100 p-8 rounded-xl w-full max-w-3xl space-y-6">
            
            <div className="flex justify-between items-center">
            <div>
                <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search tasks..."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
            </div>
            <div>
                <Link
                to={'/tasks/register'}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                CREATE NEW TASK
                </Link>
            </div>
            </div>

            <div className="flex justify-center">
            <button
                onClick={() => setFinished(!finished)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
                {finished ? 'Switch to Current' : 'Switch to Finished'}
            </button>
            </div>

            {tasks && (
            <ul className="space-y-4">
                {tasks.map(task => (
                <li
                    key={task.task_id}
                    className="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow"
                >
                    <Link to={`/tasks/${task.task_id}`} className="block space-y-1">
                    <p><span className="font-semibold">ID:</span> {task.task_id}</p>
                    <p><span className="font-semibold">START LOCATION:</span> {task.start_location}</p>
                    <p><span className="font-semibold">END LOCATION:</span> {task.end_location}</p>
                    <p>
                        <span className="font-semibold">START TIME:</span> {new Date(task.start_time).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                        })}
                    </p>
                    <p>
                        <span className="font-semibold">END TIME:</span> {task.end_time ? new Date(task.end_time).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                        }) : 'Not finished yet!'}
                    </p>
                    <p>
                        <span className="font-semibold">Description:</span> {task.description ? task.description : 'No description'}
                    </p>
                    </Link>
                </li>
                ))}
            </ul>
            )}

        </div>
        </div>
    )
}