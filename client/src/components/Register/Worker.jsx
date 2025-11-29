import axios from "axios"
import { useState } from "react"

export default function(){

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassowrd] = useState('')
    const [managerId, setManagerId] = useState('')

    const [msg, setMsg] = useState(null)

    async function handleRegister(e){
        e.preventDefault()

        try {

            setMsg(null)

            if(!firstName || !lastName || !email | !password){
                setMsg('All fields must be filled!')
                return
            }

           const res = await axios.post('http://localhost:8000/api/workers/register', 
            {
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "password": password,
                "manager_id": managerId ? managerId : null
            })

            setFirstName('')
            setLastName('')
            setEmail('')
            setPassowrd('')
            setManagerId('')

            setMsg("Successfully registered, you can log in now!")


        } catch (error) {
            setMsg(error.response?.data?.error || "Something went wrong, please try again later!")
        }
    }

    return(
        <div>
        <form onSubmit={handleRegister}>
            <input type="text" placeholder="First name" autoComplete="username" value={firstName} onChange={e => setFirstName(e.target.value)}></input>
            <input type="text" placeholder="Last name" autoComplete="username" value={lastName} onChange={e => setLastName(e.target.value)}></input>
            <input type="email" placeholder="Email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}></input>
            <input type="password" placeholder="Password" autoComplete="new-password" value={password} onChange={e => setPassowrd(e.target.value)}></input>
            <input type="text" placeholder="Manager Id (optional)" value={managerId} onChange={e => setManagerId(e.target.value)}></input>
            <button type="submit">Register</button>
        </form>
        {msg && <p>{msg}</p>}
        </div>
    )
}