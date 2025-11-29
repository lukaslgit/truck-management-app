import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import NotFound from './components/NotFound'
import Profile from './components/Profile'
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
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
  );
}
