const express = require('express')
const router = express.Router()

const User = require('../model/user')

//get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('commuteHistory');
        res.json(users);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
});

//create a new user
router.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body
        const user = new User({name, email, password});
        await user.save()
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

module.exports = router;