import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import NotFound from './components/NotFound'
import Profile from './components/Profile'
import axios from 'axios'

export default function(){

  const navigate = useNavigate()

  async function handleLogOut(){
    try {
      const res = axios.post('http://localhost:8000/api/workers/logout', {}, {withCredentials: true})

      console.log('You have been loged out!')

      //TODO add notifications

      navigate('/')

    } catch (error) {
      console.log('Something went wrong!')
    }
  }

  return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/register'>Register</Link>
            </li>
            <li>
              <Link to={'/profile'}>Profile</Link>
            </li>
            <li>
              <button onClick={handleLogOut}>LogOut</button>
            </li>
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
