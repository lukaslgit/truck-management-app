import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const {login} = useAuth()

    async function handleLogin(e){
        e.preventDefault()
        try {

            setError(null)

            if (!email || !password){
                setError('All fields must be filled!')
                return
            }

            await login(email, password, false)

            setError(null)

            // TODO add notification 'Logged in!'

            navigate('/profile')

        } catch (error) {

           setError(error.response?.data?.error || "Something went wrong, please try again later!");
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin} className="space-y-4">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
            />

            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">LOGIN</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    )
}