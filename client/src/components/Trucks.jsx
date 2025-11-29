import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function(){

    const navigate = useNavigate()

    const { user, loading } = useAuth()

    useEffect(() => {
        if (!user && !loading){
            navigate('/')
        }

        if (user?.role != 'manager' && !loading){
            navigate('/')
        }
    },[user, loading])

    
    return(
        <>
            <div>
                <div>SEARCHBAR</div>
                <div><Link to={'/trucks/register'}>ADD NEW TRUCK</Link></div>
            </div>
            <div>TRUCKS</div>
        </>
    )
}