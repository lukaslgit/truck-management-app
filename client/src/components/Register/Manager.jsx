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
            <form onSubmit={handleRegister} className="flex flex-col">
                <div className='flex flex-col gap-3'>
                    <input
                    type="text"
                    placeholder="First name"
                    autoComplete="username"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="min-w-50 mx-auto border-2 border-gray-600 px-5 py-1 rounded-md"
                    required
                    />

                    <input
                    type="text"
                    placeholder="Last name"
                    autoComplete="username"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="min-w-50 mx-auto border-2 border-gray-600 px-5 py-1 rounded-md"
                    required
                    />

                    <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="min-w-50 mx-auto border-2 border-gray-600 px-5 py-1 rounded-md"
                    required
                    />

                    <input
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassowrd(e.target.value)}
                    className="min-w-50 mx-auto border-2 border-gray-600 px-5 py-1 rounded-md"
                    required
                    />

                    <input
                    type="number"
                    placeholder="KEY"
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    className="min-w-50 mx-auto border-2 border-gray-600 px-5 py-1 rounded-md"
                    />
                </div>
                <button
                type="submit"
                className="m-auto mt-10 bg-gray-800 min-w-50 text-white px-5 py-1 rounded-md text-md cursor-pointer hover:bg-gray-600 transition-colors"
                >
                REGISTER
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