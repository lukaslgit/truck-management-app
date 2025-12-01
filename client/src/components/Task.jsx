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
                            note.manager_name = managerRes.data.first_name + ' ' + managerRes.data.last_name
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

                getNotes(taskId)
            } catch (error) {
                console.log(error)
            }
        }


    return(
        <div className="p-10">
            <div>
                {msg && <p>{msg}</p>}
            </div>

            {task && <div>
                <br></br>
                <p><span className="font-bold">ID:</span> {task.task_id}</p>
                <p><span className="font-bold">Start location:</span> {task.start_location}</p>
                <p><span className="font-bold">End location:</span> {task.end_location}</p>
                <p><span className="font-bold">Start time:</span> {new Date(task.start_time).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                <p><span className="font-bold">End time:</span> {task.end_time ? new Date(task.end_time).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : 'Not finished yet!'}</p>
                <p><span className="font-bold">Driver:</span> {driver?.first_name} {driver?.last_name} (Worker ID: {task.driver_id})</p>
                <p><span className="font-bold">Manager:</span> {manager?.first_name} {manager?.last_name} (Manager ID: {task.manager_id})</p>
                <Link to={`/trucks/${task.truck_id}`} ><p><span className="font-bold">Truck:</span> {truck?.truck_name} (Truck ID: {task.truck_id}) </p></Link>
                <br></br>
                <p>Description:</p>
                <p>{task.description}</p>
                <br></br>
                {task.finished ? <button className="font-bold" onClick={() => handleReopenTask(task.task_id)} >REOPEN THE TASK</button> : <button className="font-bold" onClick={() => handleFinishTask(task.task_id)} >MARK AS FINISHED</button>}


                <form onSubmit={handleRegisterTask}>
                    <br></br>
                    <p className="font-bold">WRITE NEW NOTE:</p>
                    <textarea placeholder="NEW NOTE" rows={4} value={newNote} onChange={e => setNewNote(e.target.value)}></textarea>
                    <button type="submit">ADD NOTE</button>
                </form>

                {notes &&
                <ul>
                    <br></br>
                    {notes.map(note => <li key={note.note_id}>
                        <p>Author: {note.manager_id ? note.manager_name : driver?.first_name + ' ' + driver?.last_name}</p>
                        <p>Message: {note.note_text}</p>
                        <br></br>
                    </li>)}
                </ul>
                }


            </div>}
        </div>
    )
}