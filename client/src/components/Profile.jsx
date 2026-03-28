import { useAuth } from "../context/AuthContext.jsx"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from '../api/axios.js'
import Worker from "./Profile/Worker.jsx"
import Manager from "./Profile/Manager.jsx"

export default function(){

    const navigate = useNavigate()
    const {user, loading} = useAuth()

    useEffect(() => {
        if (!loading){
            if(!user){
                navigate('/login')
            }
        }
    },[user, loading])


    if(loading){
        return(
            <>LOADING...</>
        )
    }
    
    return(
        <div>
        {user && user.role == 'manager' && <Manager user={user} />}
        {user && user.role == 'worker' && <Worker user={user} />}
        </div>

    )
}