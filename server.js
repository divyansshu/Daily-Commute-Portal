const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./model/db')
const axios = require('axios')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

dotenv.config();
connectDB()

const app = express()

const corsOption = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders:['Content-Type', 'Authorization']
}
app.use(cors(corsOption))
// ✅ Handle preflight requests
app.options('*', cors(corsOption))
app.use(express.json())

//rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes window
    max: 100,  // Limit each IP to 100 requests per window
    message: 'Too many requests, please try again later.'
});

app.use(limiter) //apply rate limiting globally


const authRoutes = require('./routes/authRoutes')
const commuteRoutes = require('./routes/commuteRoutes')
const routeRoutes = require('./routes/routeRoutes')
const userRoutes = require('./routes/userRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/commutes', commuteRoutes)
app.use('/api/route', routeRoutes)
app.use('/api/users', userRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port ${PORT}`));