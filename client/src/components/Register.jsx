import { useState, useEffect } from "react"
import Manager from "./Register/Manager.jsx"
import Worker from "./Register/Worker.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate, Link } from "react-router-dom"
import truckbg from '../assets/truckbg.jpg'

export default function(){

    const {user, loading} = useAuth()
    const navigate = useNavigate()

    const [isManager, setIsManager] = useState(false)

    useEffect(() => {
        if (!loading){
            if(user){
                navigate('/profile')
            }
        }
    },[user, loading])

    function displayForm(){
        if (isManager) {
            return <Manager />
        } else

        return <Worker />
    }

    return(


        <div className="min-h-screen flex bg-sky-50 py-10 sm:py-0">
            <div className="flex justify-center m-auto w-full px-4 sm:px-0">
                <div className="bg-white text-gray-800 w-full sm:w-120 sm:h-130 flex flex-col justify-center rounded-xl sm:rounded-l-xl sm:rounded-r-none shadow-2xl py-10 sm:py-0">
                    <div className="flex flex-col items-center mb-5">
                        <h1 className="text-3xl font-black">REGISTER PAGE</h1>
                        <p>Already have an account? <Link to='/login' className="text-black underline">Login Page</Link></p>
                    </div>
                    <div className="flex gap-3 justify-center mb-10">
                        <button onClick={() => setIsManager(false)} className={`w-35 rounded-lg border-2 px-4 py-1 text-sm cursor-pointer transition-all ${isManager ? "border-gray-600 text-black hover:bg-gray-800 hover:border-gray-800 hover:text-white" : "bg-gray-800 border-gray-800 text-white"}`}>DRIVER</button>
                        <button onClick={() => setIsManager(true)} className={`w-35 rounded-lg border-2 px-4 py-1 text-sm cursor-pointer transition-all ${isManager ? "bg-gray-800 border-gray-800 text-white" : "border-gray-600 text-black hover:bg-gray-800 hover:border-gray-800 hover:text-white"}`}>MANAGER</button>
                    </div>
                    <div>
                        {displayForm()}
                    </div>
                </div>
                <div className="hidden sm:block shadow-2xl relative text-white w-120 h-130 rounded-r-xl bg-cover before:absolute before:inset-0 before:bg-black before:opacity-30 before:z-0 overflow-hidden" style={{ backgroundImage: `url(${truckbg})`, backgroundPosition: '60% 50%' }}>
                </div>
            </div>
        </div>
    )
}
