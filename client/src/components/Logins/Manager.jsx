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

            await login(email, password, true)

            setError(null)

            // TODO add notification 'Logged in!'

            navigate('/profile')

        } catch (error) {

           setError(error.response?.data?.error || "Something went wrong, please try again later!");
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin} className="flex flex-col">
                <div className='flex flex-col gap-3'>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="min-w-50 mx-auto border-2 border-gray-600 px-5 py-1 rounded-md"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="min-w-50 mx-auto border-2 border-gray-600 px-5 py-1 rounded-md"
                        required
                    />
                </div>
            <button type="submit" className="m-auto mt-10 bg-gray-800 min-w-50 text-white px-5 py-1 rounded-md text-md cursor-pointer hover:bg-gray-600 transition-colors">LOG IN</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    )
}