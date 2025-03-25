import React, {useState} from 'react'
import {login} from '../services/api'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const {data} = await login({email, password})
            localStorage.setItem('token', data.token)
            navigate('/dashboard')
        } catch (error) {
            console.error('Login error: ', error)
            setError('Invalid credentials. Try again.')
        }
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                />
                <input type="password"
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                />

                <button type='submit'>Login</button>
            </form>
            <p>Don't have an account</p>
            <a href="/register">Register</a>
            {error && <p>{error}</p>}
        </div>
    )
}
export default Login