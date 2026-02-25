import { UserIcon } from '@heroicons/react/24/outline'
import truckbg from '../assets/truckbg.jpg'
import { useState, useRef } from 'react'

export default function(){

    const [manager, setManager] = useState(false)

    const rolesRef = useRef(null);
    
    return(
        <>
            <div className="relative flex justify-center items-end h-[calc(100vh-30px)] pb-10 bg-cover text-white before:absolute before:inset-0 before:bg-black before:opacity-30 before:z-0" style={{ backgroundImage: `url(${truckbg})` }}>
                <div className='w-350 pb-20 relative z-10'>
                    <h1 className="font-bold text-4xl pb-4 text-shadow-lg/20">Truck Manager App (WIP)</h1>
                    <p className='text-2xl text-shadow-lg/20'>Manage trucks, tasks, and drivers through a clear and structured interface.</p>
                    <button onClick={() => rolesRef.current?.scrollIntoView({ behavior: 'smooth' })} className='mt-10 p-3 px-10 rounded-lg border-3 bg-gray-800/20 text-white border-sky-200 font-bold cursor-pointer hover:border-white'>Find out more!</button>
                </div>
            </div>

            <div ref={rolesRef} className='flex justify-center pt-15'>
                <div className="flex w-400 pb-10 justify-center">
                    <h2 className="font-bold pb-2 flex items-start mr-5"><UserIcon className="h-10 w-10 mr-2" /></h2>
                    <div>
                        <h2 className='font-bold text-3xl'>User Roles</h2>
                    </div>
                </div>
            </div>

            <div className='flex justify-center'>
                <div className='flex gap-5'>
                    <button onClick={() => setManager(false)} className={`w-50 rounded-lg border-3 px-4 py-1 text-xl cursor-pointer transition-all ${manager ? "border-gray-600 text-black hover:bg-gray-800 hover:border-gray-800 hover:text-white" : "bg-gray-800 border-gray-800 text-white"}`}>DRIVERS</button>
                    <button onClick={() => setManager(true)} className={`w-50 rounded-lg border-3 px-4 py-1 text-xl cursor-pointer transition-all ${manager ? "bg-gray-800 border-gray-800 text-white" : "border-gray-600 text-black hover:bg-gray-800 hover:border-gray-800 hover:text-white"}`}>MANAGERS</button>
                </div>
            </div>

                <div className='flex justify-center mt-10 h-150'>
                    {manager ? 
                        <div>
                            <div className='w-100'>
                                <h2 className='font-bold text-2xl text-center'>Managers have full access</h2>
                                <p className='text-center'>they can:</p>
                                <ul className='mt-5 flex flex-col gap-5'>
                                    <li className='homepage-list'>View and manage all trucks</li>
                                    <li className='homepage-list'>Register new trucks</li>
                                    <li className='homepage-list'>View detailed truck information</li>
                                    <li className='homepage-list'>Chat with workers</li>
                                    <li className='homepage-list'>Create and manage tasks</li>
                                    <li className='homepage-list'>Assign and monitor tasks</li>
                                    <li className='homepage-list'>Manage workers</li>
                                    <li className='homepage-list'>View detailed worker profiles</li>
                                </ul>
                            </div>
                        </div> 
                        : 
                        <div>
                            <div className='w-100'>
                                <h2 className='font-bold text-2xl text-center'>Drivers have limited access</h2>
                                <p className='text-center'>they can:</p>
                                <ul className='mt-5 flex flex-col gap-5'>
                                    <li className='homepage-list'>Access their profile</li>
                                    <li className='homepage-list'>View assigned tasks</li>
                                    <li className='homepage-list'>View task details</li>
                                    <li className='homepage-list'>Chat with managers</li>
                                </ul>
                            </div>
                        </div> 
                    }
                </div>
            
            <div className='bg-gray-800'>
            <div className='flex justify-center'>
                <h2 className='text-4xl font-bold pt-15 text-white'>App Features</h2>
            </div>

            <div className='flex justify-center mt-15 mb-20'>
                <div className="w-350 pb-10 flex">
                    <div className='w-175 text-center'>
                        <h2 className="font-bold text-3xl text-white mb-2">Truck Management</h2>
                        <div className='w-50 border-b-2 m-auto border-gray-800'></div>
                        <ul className="mt-5 flex flex-col gap-5 w-100 m-auto text-white">
                            <li className='homepage-list'>
                                View a list of all registered trucks
                            </li>
                            <li className='homepage-list'>
                                Add new trucks to the system
                            </li>
                            <li className='homepage-list'>
                                View detailed information about each truck
                            </li>
                        </ul>
                    </div>
                    <div className="pb-10 w-175 text-center">
                        <h2 className="font-bold text-3xl mb-2 text-white">Task Management</h2>
                        <div className='w-50 border-b-2 m-auto border-gray-800'></div>
                        <ul className="mt-5 flex flex-col gap-5 w-100 m-auto text-white">
                            <li className='homepage-list'>
                                Chat with the worker asigned to the task
                            </li>
                            <li className='homepage-list'>
                                Create new tasks
                            </li>
                            <li className='homepage-list'>
                                View all tasks
                            </li>
                            <li className='homepage-list'>
                                View detailed task information
                            </li>
                            <li className='homepage-list'>
                                Assign tasks to workers
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>


            <div className='flex justify-center'>
                <h2 className='text-4xl font-bold'>Technology Stack</h2>
            </div>

            <div className='flex justify-center mt-15'>
                <div className="w-350 pb-10 flex">
                    <div className='w-175 text-center'>
                        <h2 className="font-bold text-3xl mb-2">Frontend (REACT)</h2>
                        <div className='w-50 border-b-2 m-auto border-gray-800'></div>
                        <ul className="mt-5 flex flex-col gap-5 w-100 m-auto">
                            <li className='homepage-list'>Vite</li>
                            <li className='homepage-list'>Context API</li>
                            <li className='homepage-list'>Axios</li>
                            <li className='homepage-list'>Tailwind CSS</li>
                        </ul>
                    </div>
                    <div className="pb-10 w-175 text-center">
                        <h2 className="font-bold text-3xl mb-2">Backend (Express.js)</h2>
                        <div className='w-50 border-b-2 m-auto border-gray-800'></div>
                        <ul className="mt-5 flex flex-col gap-5 w-100 m-auto">
                            <li className='homepage-list'>bcrypt</li>
                            <li className='homepage-list'>jsonwebtoken</li>
                            <li className='homepage-list'>cookie-parser</li>
                            <li className='homepage-list'>custom middleware for auth</li>
                            <li className='homepage-list'>pg</li>
                            <li className='homepage-list'>dotenv</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='flex justify-center mb-40'>
                <div className='m-auto'>
                    <h2 className='text-3xl font-bold text-center'>Database</h2>
                    <div className='w-50 border-b-2 m-auto border-gray-800'></div>
                    <ul className="mt-5 flex flex-col gap-5 w-100 m-auto">
                        <li className='homepage-list'>PostgreSQL</li>
                    </ul>
                </div>
            </div>
        </>
    )
}