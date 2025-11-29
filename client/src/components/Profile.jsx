import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function(){

    const navigate = useNavigate()

    useEffect(() => {
        handleIsLogged()
    },[])

    async function handleIsLogged(){
        try {
            const res = await axios.get('http://localhost:8000/api/workers/me', {withCredentials: true})

            const user = res.data.user

            console.log(user)

        } catch (error) {
            //console.log(error)
            navigate('/login')
        }
    }

    return(
        <>
            <p>PROFILE</p>
        </>
    )
}