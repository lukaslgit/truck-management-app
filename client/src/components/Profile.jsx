import { useAuth } from "../context/AuthContext.jsx"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function(){

    const navigate = useNavigate()

    const {user} = useAuth()

    useEffect(() => {
        if (!user){
            navigate('/login')
        }
    },[])

    return(
        <>
            <p>PROFILE</p>
        </>
    )
}