import { Link } from "react-router-dom";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function(){

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'manager') {
                navigate('/');
            }
        }
    }, [user, loading])


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
        
        </>


    )
}