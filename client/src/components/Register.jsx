import { useState, useEffect } from "react"
import Manager from "./Register/Manager.jsx"
import Worker from "./Register/Worker.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"

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
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-sky-100 p-8 rounded-xl shadow-lg w-full max-w-md">
                
                <div className="mb-6 text-center ">
                <h2 className="font-bold text-2xl text-gray-800 mb-4">
                {isManager ? 'Manager' : 'Worker'} Register Page
                </h2>
                <button
                    onClick={() => setIsManager(!isManager)}
                    className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    REGISTER AS {isManager ? 'WORKER' : 'MANAGER'}
                </button>
                </div>

                <div className="space-y-4">
                {displayForm()}
                </div>
                
            </div>
        </div>
    )
}