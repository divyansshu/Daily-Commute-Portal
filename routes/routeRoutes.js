const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()

const ORS_API_KEY = process.env.ORS_API_KEY
const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/directions/driving-car'

//fare estimation constants
const BASE_FARE = 50
const COST_PER_KM = 10
const COST_PER_MIN = 2
const MINIMUM_FARE = 70

//route planning endpoint
router.post('/', async (req, res) => {

    try {
        const { start, end } = req.body
        if (!start || !end) {
            return res.status(400).json({ error: 'Start and end locations are required' })
        }
        const response = await axios.get(ORS_BASE_URL, {
            headers: {
                'Authorization': process.env.ORS_API_KEY
            },
            params: {
                start: `${start[0]},${start[1]}`,    // Correct: latitude,longitude
                end: `${end[0]},${end[1]}`,           // Correct: latitude,longitude
                radiuses: '1000,1000'
            }
        });

        const route = response.data.routes[0]
        if (!route) {
            return res.status(404).json({ error: 'Route not Found' })
        }

        //extract distance and duration
        const distanceInMeters = route.summary.distance
        const durationInSeconds = route.summary.duration
        const distanceInKm = distanceInMeters / 1000
        const durationInMin = Math.ceil(durationInSeconds / 60)

        let fare = BASE_FARE + (distanceInKm * COST_PER_KM) + (durationInMin * COST_PER_MIN)

        if (fare < MINIMUM_FARE) {
            fare = MINIMUM_FARE
        }

        res.json({
            route: response.data,
            fareEstimation: {
                distance: distanceInKm.toFixed(2) + 'Km',
                duration: durationInMin + 'min',
                estimatedFare: `₹${fare.toFixed(2)}`
            }
        });

    } catch (err) {
        if (err.response) {
            console.error(`Error: ${err.response.status} - ${err.response.data}`);
            res.status(err.response.status).json({ error: err.response.data });
        } else {
            console.error("Error:", err.message);
            res.status(500).json({ error: 'Failed to fetch route' });
        }
    }
});

module.exports = router
