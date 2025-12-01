import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import NotFound from './components/NotFound'
import Profile from './components/Profile'
import Trucks from './components/Trucks.jsx'
import RegisterTruck from './components/RegisterTruck.jsx'
import Truck from './components/Truck.jsx'
import Tasks from './components/Tasks.jsx'
import RegisterTask from './components/RegisterTask.jsx'
import Task from './components/Task.jsx'

import api from './api/axios.js'
import { useAuth } from './context/AuthContext.jsx'

export default function(){

  const { user, setUser } = useAuth()

  async function handleLogOut(){
    try {
      await api.post('/workers/logout')

      setUser(null)

      console.log('Logged out!')

      // TODO NOTIFICATION

    } catch (error) {
      console.log('Something went wrong!')
    }
  }

  const navigate = useNavigate()

  return (
      <div className="flex flex-col min-h-screen">
        <nav>
          <ul className='flex gap-5 items-center py-3 px-20 justify-end'>
            <li>
              <Link to='/'>Home</Link>
            </li>
            {!user && <li>
              <Link to='/login'>Login</Link>
            </li>}
            {!user && <li>
              <Link to='/register'>Register</Link>
            </li>}
            {user && <li>
              <Link to={'/profile'}>Profile</Link>
            </li>}
            {user?.role === 'manager' && <li>
              <Link to={'/trucks'}>Trucks</Link>
            </li>}
            {user?.role === 'manager' && <li>
              <Link to={'/tasks'}>Tasks</Link>
            </li>}
            {user && <li>
              <button className='cursor-pointer bg-red-500 hover:bg-red-600 px-2 py-0.5 text-white rounded-md' onClick={handleLogOut}>LogOut</button>
            </li>}
          </ul>
        </nav>

        <div className="flex-grow px-8 py-6">
        <Routes >
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/trucks' element={<Trucks />}/>
          <Route path='/trucks/register' element={<RegisterTruck />} />
          <Route path='/trucks/:truckId' element={<Truck />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/tasks/register' element={<RegisterTask />} />
          <Route path='/tasks/:taskId' element={<Task />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        </div>

      <footer className="bg-gray-800 text-white text-center py-4 mt-4 md:mt-8 shadow-inner flex flex-col items-center gap-2">
        <p className="text-sm font-semibold">TRUCK MANAGEMENT APP</p>
        <p className="text-sm font-semibold">Lukas Lutonsky</p>
        <a href="https://github.com/lukaslgit/truck-management-app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 transition-colors">GITHUB</a>
      </footer>
      </div>
  );
}
