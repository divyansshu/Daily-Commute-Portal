import axios from 'axios'
const API = axios.create({baseURL: 'http://localhost:5000/api'})

//add token to the request if available
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if(token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

//example API calls
export const login = (data) => API.post('/auth/login', data)
export const getUserProfile = () => API.get('/users/profile')