import api from "../../api/axios.js"
import { useState } from "react"

export default function(){

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassowrd] = useState('')
    const [key, setKey] = useState('')

    const [msg, setMsg] = useState(null)

    async function handleRegister(e){
        e.preventDefault()

        try {

            setMsg(null)

            if(!firstName || !lastName || !email | !password){
                setMsg('All fields must be filled!')
                return
            }

           const res = await api.post('/managers/register', 
            {
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "password": password,
                "key": key
            })

            setFirstName('')
            setLastName('')
            setEmail('')
            setPassowrd('')
            setKey('')

            setMsg("Successfully registered, you can log in now!")


        } catch (error) {
            setMsg(error.response?.data?.error || "Something went wrong, please try again later!")
        }
    }

    return(
        <div>
            <form onSubmit={handleRegister} className="space-y-4">
                <input
                type="text"
                placeholder="First name"
                autoComplete="username"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
                />

                <input
                type="text"
                placeholder="Last name"
                autoComplete="username"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
                />

                <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
                />

                <input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassowrd(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
                />

                <input
                type="number"
                placeholder="KEY"
                value={key}
                onChange={e => setKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />

                <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                Register
                </button>
            </form>

        {msg && (
            <p className="mt-4 text-center text-red-500 font-medium">
            {msg}
            </p>
        )}
        </div>
    )
}