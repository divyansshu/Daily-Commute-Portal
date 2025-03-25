import axios from 'axios'

const API_URL = 'http://localhost:5000/api/commutes'

//fetch user commute history
export const getCommuteHistory = async (token) => {
    const response = await axios.get(`${API_URL}`, {
        headers: {Authorization: `Bearer ${token}`},
    })
    return response.data
}

//fetch real time location using openRouteService API
export const getCurrentLocation = async (lat, lon) => {
    const apiKey = import.meta.env.VITE_OPENROTESERVICE_API_KEY

    const response = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${lat}&point.lon=${lon}`
    )
    return response.data
}