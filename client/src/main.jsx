import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

const root = createRoot(document.getElementById('root'))

root.render(
    <Router basename="/projects/truck_managment_app">
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>
)
