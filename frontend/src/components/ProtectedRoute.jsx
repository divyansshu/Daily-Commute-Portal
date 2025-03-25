import {Navigate} from 'react-router-dom'
import {getToken} from '../services/auth'

const ProtectedRoute = ({children}) => {
    const token = getToken()

    //redirect to login if no token is found
    return token ? children : <Navigate to='/login' />
}

export default ProtectedRoute