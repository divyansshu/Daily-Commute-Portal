import { useNavigate } from 'react-router-dom'
import {logout} from '../services/auth'

const Navbar = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    return(
        <nav>
        <h1>Commute Manager</h1>
        <div>
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>

            <button
            onClick={handleLogout}>
                Logout
            </button>
            </div>
            </nav>
    )
}
export default Navbar