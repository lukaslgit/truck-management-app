import { useState, useEffect } from "react"
import Manager from "./Logins/Manager.jsx"
import Worker from "./Logins/Worker.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"

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
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-sky-100 p-8 rounded-xl w-full max-w-md">
        
                <div className="mb-6 text-center">
                <h2 className="font-bold text-2xl text-gray-800 mb-4">
                    {isManager ? 'Manager' : 'Worker'} Login Page
                </h2>
                <button
                    className="bg-slate-500 hover:bg-slate-600 transition-colors rounded-md py-2 px-4 cursor-pointer text-white text-sm font-semibold"
                    onClick={() => setIsManager(!isManager)}
                >
                    LOGIN AS {isManager ? 'WORKER' : 'MANAGER'}
                </button>
                </div>

                <div className="space-y-4">
                {displayForm()}
                </div>

            </div>
        </div>
    )
}