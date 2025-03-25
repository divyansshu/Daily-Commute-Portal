const express = require("express")
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {body, validationResult} = require('express-validator')
const authMiddleware = require('../middleware/auth')
require('dotenv').config()

router.post('/register',[
    //input validation middleware
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async(req,res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    } 
    try {
        const {name,email,password} = req.body

        //check if user already exists
        let user = await User.findOne({email})
        if(user) {
            return res.status(400).json({message: 'user already exists'})
        }
        user = new User({name, email, password})
        await user.save()

        res.status(201).json({message: 'User registered successfully'});
    }catch(err) {
        res.status(500).json({message:err.message});
    }
});

//login user
router.post('/login',[
    // Input validation middleware
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
], async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const {email, password} = req.body

        //check if user exists
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        //validate password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({message:'invalid credentials'});
        }

        //generate jwt token
        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token, userId: user._id})
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//get user profile (protected mode)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        res.status(500).json({message: err.message})
    }
});

module.exports = router
