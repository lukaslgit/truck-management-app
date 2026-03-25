import { useState, useEffect } from "react"
import Manager from "./Logins/Manager.jsx"
import Worker from "./Logins/Worker.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate, Link } from "react-router-dom"
import truckbg from '../assets/truckbg.jpg'

export default function(){

    const {user, loading} = useAuth()
    const navigate = useNavigate()

    const [isManager, setIsManager] = useState(false)

    function displayForm(){
        if (isManager) {
            return <Manager />
        } else

        return <Worker />  
    }

    useEffect(() => {
            if (!loading){
                if(user){
                    navigate('/profile')
                }
            }
        },[user, loading])

    return(

        <div className="h-screen flex bg-sky-50">
            <div className="flex justify-center m-auto">
                <div className="bg-white text-gray-800 w-120 h-130 flex flex-col justify-center rounded-l-xl shadow-2xl">
                    <div className="flex flex-col items-center mb-5">
                        <h1 className="text-3xl font-black">LOGIN PAGE</h1>
                        <p>Don't have an account? <Link to='/register' className="text-black underline">Register Page</Link></p>
                    </div>
                    <div className="flex gap-3 justify-center mb-10">
                        <button onClick={() => setIsManager(false)} className={`w-35 rounded-lg border-2 px-4 py-1 text-sm cursor-pointer transition-all ${isManager ? "border-gray-600 text-black hover:bg-gray-800 hover:border-gray-800 hover:text-white" : "bg-gray-800 border-gray-800 text-white"}`}>DRIVER</button>
                        <button onClick={() => setIsManager(true)} className={`w-35 rounded-lg border-2 px-4 py-1 text-sm cursor-pointer transition-all ${isManager ? "bg-gray-800 border-gray-800 text-white" : "border-gray-600 text-black hover:bg-gray-800 hover:border-gray-800 hover:text-white"}`}>MANAGER</button>
                    </div>
                    <div>
                        {displayForm()}
                    </div>
                </div>
                <div className="shadow-2xl relative m-auto text-white w-120 h-130 rounded-r-xl bg-cover before:absolute before:inset-0 before:bg-black before:opacity-30 before:z-0 overflow-hidden" style={{ backgroundImage: `url(${truckbg})`, backgroundPosition: '60% 50%' }}>
                </div>
            </div>
        </div>
    )
}