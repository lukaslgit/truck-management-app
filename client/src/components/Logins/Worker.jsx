import api from '../../api/axios.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { setUser } = useAuth()

    async function handleLogin(e){
        e.preventDefault()
        try {

            setError(null)

            if (!email || !password){
                setError('All fields must be filled!')
                return
            }

            const res = await api.post('/workers/login', {"email": email, "password": password})
            
            setUser(res.data)
            setError(null)

            // TODO add notification 'Logged in!'

            navigate('/profile')

        } catch (error) {

           setError(error.response?.data?.error || "Something went wrong, please try again later!");
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input placeholder="email" type='email' value={email} onChange={e => setEmail(e.target.value)}></input>
                <input placeholder="password" type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
                <button type='submit'>LOGIN</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    )
}