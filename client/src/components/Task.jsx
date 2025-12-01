import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from '../api/axios.js'

export default function(){

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    const { taskId } = useParams()
    const [msg, setMsg] = useState(null)
    const [task, setTask] = useState(null)
    const [driver, setDriver] = useState(null)
    const [manager, setManager] = useState(null)
    const [truck, setTruck] = useState(null)
    const [notes, setNotes] = useState([])

    const [newNote, setNewNote] = useState('')

    useEffect(() => {
            if (!loading) {
                if (!user) {
                    navigate('/');
                } else {
                    getTask(taskId);
                    getNotes(taskId)
                }
            }
        }, [user, loading]);
    
        async function getDriverById(id){
            try {
                const res = await api.get(`workers/${id}`)

                setDriver(res.data)
    
            } catch (error) {
                console.log(error)
            }
        }

        async function getManagerById(id){
            try {
                const res = await api.get(`managers/${id}`)
        
                setManager(res.data)
        
            } catch (error) {
                setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
            }
        }

        async function getTruckById(id){
            try {

                const res = await api.get(`/trucks/${id}`)

                setTruck(res.data)

            } catch (error) {
                console.log(error)
            }
        }
    
        async function getTask(id){
            try {
                setMsg(null)
    
                if(!id){
                    setMsg('No ID!')
                    return
                }
    
                const res = await api.get(`tasks/${id}`)
    
                setTask(res.data)

                if (user.role != 'manager' && res.data.driver_id != user.worker_id) {
                    navigate('/')
                    return
                }
    
                getDriverById(res.data.driver_id)
                getManagerById(res.data.manager_id)
                getTruckById(res.data.truck_id)
    
    
            } catch (error) {
                setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
            }
        }

        async function handleFinishTask(id){
            try {
                await api.post(`tasks/end/${id}`)

                getTask(id)
            } catch (error) {
                setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
            }
        }

        async function handleReopenTask(id) {
            try {
                await api.post(`tasks/reopen/${id}`)

                getTask(id)
            } catch (error) {
                setMsg(error.response?.data?.error || 'Something went wrong, please try again later.')
            }
        }

        async function getNotes(id) {
            try {
                const res = await api.get(`notes/${id}`)
                const fetchedNotes = res.data

                const updatedNotes = await Promise.all(
                    fetchedNotes.map(async note => {
                        if (note.manager_id) {
                            const managerRes = await api.get(`managers/${note.manager_id}`)
                            note.manager_name = managerRes.data.first_name + ' ' + managerRes.data.last_name + ' ' + '(ID: ' + managerRes.data.manager_id + ')'
                        }
                        return note
                    })
                )

                setNotes(updatedNotes)

            } catch (error) {
                console.log(error)
            }
        }

        async function handleRegisterTask(e){
            e.preventDefault()

            try {
                setMsg(null)

                if(!newNote){
                    setMsg('You have to enter something!')
                    return
                }

                if(user.role == 'manager'){
                    await api.post('/notes/register', {"note_text": newNote, "task_id": taskId, "manager_id": user.manager_id})
                } else {
                    await api.post('/notes/register', {"note_text": newNote, "task_id": taskId, "worker_id": user.worker_id})
                }

                setNewNote('')

                getNotes(taskId)
            } catch (error) {
                console.log(error)
            }
        }


    return(
        <div className="flex justify-center min-h-screen items-start pt-20">
            <div className="bg-sky-100 p-8 rounded-xl w-full max-w-3xl space-y-6">

                {msg && (
                    <div className="bg-blue-100 border border-blue-300 text-blue-700 p-3 rounded-md">
                        {msg}
                    </div>
                )}
                {task && (
                    <div className="bg-white p-6 rounded-lg shadow space-y-4">

                        <p><span className="font-semibold">ID:</span> {task.task_id}</p>
                        <p><span className="font-semibold">Start location:</span> {task.start_location}</p>
                        <p><span className="font-semibold">End location:</span> {task.end_location}</p>

                        <p>
                            <span className="font-semibold">Start time:</span>{" "}
                            {new Date(task.start_time).toLocaleString("en-GB", {
                                year: "numeric", month: "long", day: "numeric",
                                hour: "2-digit", minute: "2-digit", hour12: false
                            })}
                        </p>

                        <p>
                            <span className="font-semibold">End time:</span>{" "}
                            {task.end_time
                                ? new Date(task.end_time).toLocaleString("en-GB", {
                                    year: "numeric", month: "long", day: "numeric",
                                    hour: "2-digit", minute: "2-digit", hour12: false
                                })
                                : "Not finished yet!"}
                        </p>

                        <p><span className="font-semibold">Driver:</span> {driver?.first_name} {driver?.last_name} (Worker ID: {task.driver_id})</p>
                        <p><span className="font-semibold">Manager:</span> {manager?.first_name} {manager?.last_name} (Manager ID: {task.manager_id})</p>

                        <Link
                            to={`/trucks/${task.truck_id}`}
                            className="text-blue-600 hover:underline"
                        >
                            <span className="font-semibold">Truck:</span> {truck?.truck_name} (Truck ID: {task.truck_id})
                        </Link>

                        <div>
                            <p className="font-semibold">Description:</p>
                            <p className="text-gray-700">{task.description}</p>
                        </div>

                        <div>
                            {task.finished ? (
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md"
                                    onClick={() => handleReopenTask(task.task_id)}
                                >
                                    REOPEN THE TASK
                                </button>
                            ) : (
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
                                    onClick={() => handleFinishTask(task.task_id)}
                                >
                                    MARK AS FINISHED
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleRegisterTask} className="space-y-2 pt-4">
                            <label className="font-semibold">WRITE NEW NOTE:</label>
                            <textarea
                                placeholder="NEW NOTE"
                                rows={4}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:border-blue-400"
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                            ></textarea>

                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                            >
                                ADD NOTE
                            </button>
                        </form>

                        {notes && (
                            <ul className="space-y-4 pt-4">
                                {notes.map(note => (
                                    <li
                                        key={note.note_id}
                                        className="bg-gray-100 p-4 rounded-md border border-gray-300"
                                    >
                                        {new Date(note.created_at).toLocaleString("en-GB", {
                                            year: "numeric", month: "long", day: "numeric",
                                            hour: "2-digit", minute: "2-digit", hour12: false
                                        })}
                                        <p className="font-semibold">
                                            Author:{" "}
                                            {note.manager_id
                                                ? note.manager_name
                                                : `${driver?.first_name} ${driver?.last_name} (ID: ${driver?.worker_id})`
                                            }
                                        </p>
                                        <p className="text-gray-700">Message: {note.note_text}</p>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                )}
            </div>
        </div>

    )
}