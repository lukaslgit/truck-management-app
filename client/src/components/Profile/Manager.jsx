import { useEffect, useState } from "react"
import truckbg from '../../assets/truckbg.jpg'
import api from '../../api/axios.js'
import { Link } from "react-router-dom"

export default function({ user }){

    const [searchBar, setSearchBar] = useState('')
    const [errorMsg, setErrorMsg] = useState('There are no drivers under your managment!')

    useEffect(() => {

        if(searchBar.length > 2){
            searchManagersWorkersSearchbar()
        } else {
            setErrorMsg('There are no drivers under your managment!')
            searchManagersWorkers(user.manager_id)
        }
    }, [searchBar, user])

    const [managersWorkers, setManagersWorkers] = useState([])
    

    async function searchManagersWorkers(manager_id){
            try {
                const res = await api.get(`workers/managerid/${manager_id}`)

                setManagersWorkers(res.data)
            } catch (error) {
                if (error.response.data.error){
                    setErrorMsg(error.response.data.error)
                    return
                } else
                console.log('Something went wrong!')
            }
        }

    async function searchManagersWorkersSearchbar(){
        try {
            const res = await api.get(`workers/searchManagersWorkers/${user.manager_id}/${searchBar}`)
            
            if (res.data.length === 0){
                setErrorMsg('There are no drivers under your managment with this name!')
            }

            setManagersWorkers(res.data)

        } catch (error) {
            setManagersWorkers([])
        }
    }

    return(
        <>
        
            <section className="bg-white">
                <div className="relative w-full h-80 bg-center bg-cover" style={{ backgroundImage: `url(${truckbg})` }}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                </div>
                <div className="w-10/12 h-50 flex m-auto">
                <div className="flex justify-center gap-5">
                    <div className="w-fit h-full flex justify-center items-center">
                        <div
                            className="rounded-full h-48 w-48 bg-center bg-cover border-6 border-sky-50 shadow-2xl -translate-y-1/4"
                                style={{ backgroundImage: `url(${truckbg})` }}
                        ></div>
                    </div>
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-2xl font-black mb-2">{user.first_name} {user.last_name} [Manager]</h1>
                        <p className="text-gray-700">{user.email}</p>
                        <p className="text-gray-500">Phone number social links etc. [WIP]</p>
                    </div>
                </div>
                </div>
            </section>
            <section className="w-full bg-gray-100 pt-5">
                <div className="w-10/12 m-auto flex">
                    <div className="w-1/4 h-100">
                        <p>phone number</p>
                        <p>email</p>
                        <button>CHAT</button>
                    </div>
                    <div className="w-3/4 h-100">
                        <p className="text-xl font-bold">Drivers you manage:</p>

                            <div>

                                <div className="mt-5 mb-3">
                                    <input onChange={(e) => setSearchBar(e.target.value)} placeholder="Search... [Min. 3 Chars]" className="border-2 border-gray-700 rounded-md py-2 px-5"></input>
                                </div>

                            {managersWorkers.length == 0 &&<div><h2 className="font-bold">{errorMsg}</h2></div>}
                            {managersWorkers.length > 0 && 
                            <div>
                                <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {managersWorkers.map(worker => 
                                    <li key={worker.worker_id} className="bg-white py-5 px-2 rounded-md">
                                        <Link to={`/workers/${worker.worker_id}`}>
                                        <p className="font-bold">{worker.first_name} {worker.last_name}</p>
                                        <p>See more details...</p>
                                        </Link>
                                    </li>)}
                                </ul>
                            </div>}

                            </div>
                            


                    </div>
                </div>
            </section>

        </>
        
    )
    
}