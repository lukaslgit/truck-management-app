import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import NotFound from './components/NotFound'
import Profile from './components/Profile'
import Trucks from './components/Trucks.jsx'
import RegisterTruck from './components/RegisterTruck.jsx'
import Truck from './components/Truck.jsx'

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
      <div>
        <nav>
          <ul className='flex gap-5'>
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
            {user && <li>
              <button onClick={handleLogOut}>LogOut</button>
            </li>}
          </ul>
        </nav>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/trucks' element={<Trucks />}/>
          <Route path='/trucks/register' element={<RegisterTruck />} />
          <Route path='/trucks/:truckId' element={<Truck />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
  );
}
