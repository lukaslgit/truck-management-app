import { useAuth } from "../context/AuthContext.jsx"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function(){

    const navigate = useNavigate()

    const {user, loading} = useAuth()

    useEffect(() => {
        if (!user && !loading){
            navigate('/login')
        }

        console.log(user)
    },[user, loading])

    if(loading){
        return(
            <>LOADING...</>
        )
    }
    
    return(
        <>
        {user &&
        <div>
            <section>
                <h2>{user.first_name} {user.last_name}</h2>
            </section>

            <section>
                <p>{user.role === 'manager' ? `MANAGER ID: ${user.manager_id}` : `WORKER ID: ${user.worker_id}`}</p>
                <p>Email: {user.email}</p>
            </section>

            <section>
                <>WORKERS TURCK, WORKERS TASK ETC.</>
            </section>
        </div>
        }
        </>

    )
}