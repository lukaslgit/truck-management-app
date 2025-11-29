import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    async function checkAuth() {
        try {
            const res = await api.get('/workers/me')
            setUser(res.data.user)
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    async function login(email, password) {
        await api.post('/workers/login', {"email": email, "password": password})
        await checkAuth()
    }

    async function logout() {
        await api.post('/workers/logout')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout, login, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
