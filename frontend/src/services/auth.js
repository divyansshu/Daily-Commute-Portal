import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

//user registration
export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData)
    return response.data
}

//user login
export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData)

    if (response.data.token) {
        //save token in local storage
        localStorage.setItem('token', response.data.token)
    }
    return response.data
}

//logout
export const logout = () => {
    localStorage.removeItem('token')
}

//get current user token
export const getToken = () => localStorage.getItem('token')