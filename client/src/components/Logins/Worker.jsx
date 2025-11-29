import axios from 'axios'
import { useState } from 'react'

export default function(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    async function handleLogin(e){
        e.preventDefault()
        try {

            setError(null)

            if (!email || !password){
                setError('All fields must be filled!')
                return
            }

            const res = await axios.post('http://localhost:8000/api/workers/login', {"email": email, "password": password}, {withCredentials: true})

            console.log(res.data)
            setError(null)

            // TODO NAVIGATE TO PROFILE PAGE

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