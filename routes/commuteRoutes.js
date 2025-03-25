const express = require('express')
const router = express.Router()
const Commute = require('../model/commute')
const User = require('../model/user')
const authMiddleware = require('../middleware/auth')
const {body, param, validationResult} = require('express-validator')

//create a new commute entry (protected route)
router.post('/', authMiddleware,[
    // Input validation middleware
    body('startLocation').isArray({ min: 2, max: 2 }).withMessage('Start location must be an array of [lat, lng]'),
    body('startLocation.*').isFloat().withMessage('Latitude and Longitude must be numbers'),

    body('destination').isArray({ min: 2, max: 2 }).withMessage('Destination must be an array of [lat, lng]'),
    body('destination.*').isFloat().withMessage('Latitude and Longitude must be numbers'),

    body('distance').isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
    body('duration').isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
    body('fareEstimation').isFloat({ min: 0 }).withMessage('Fare estimation must be a positive number')
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const {startLocation, destination, distance , duration, fareEstimation} = req.body

        const commute = new Commute({
            user:req.user.id,
            startLocation,
            destination,
            distance,
            duration,
            fareEstimation
        });
        await commute.save();

        // Push the commute ID to the user's commute history
        await User.findByIdAndUpdate(req.user.id, {$push: {commuteHistory: commute._id}});
        res.status(201).json({message: 'commute saved successfully', commute});
    } catch (err) {
        console.error('Error creating commute:', err.message);
        res.status(400).json({error: err.message});
    }
});

//get user's commute history (protected route)
router.get('/history',authMiddleware,[
    // Input validation middleware for pagination
    body('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    body('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], async (req, res) => {
    try {
        let {page, limit} = req.query

        // Set default values
        page = parseInt(page) || 1;          // Default to page 1
        limit = parseInt(limit) || 10;        // Default to 10 records per page

        const skip = (page - 1) * limit

        //retrieve paginated commutes
        const commutes = await Commute.find({user: req.user.id})
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1});
        //get the total number of commutes
        const totalCommutes = await Commute.countDocuments({user: req.user.id})

        res.json({
            total: totalCommutes,
            page,
            limit,
            totalPages: Math.ceil(totalCommutes / limit),
            commutes
        });
    } catch (err) {
        console.error('Error fetching commutes:', err.message);
        res.status(500).json({error: err.message});
    }
});

//delete a commute history
router.delete('/:id', authMiddleware, [
    //Validate commute ID
    param('id').isMongoId().withMessage('Invalid commute ID format')
],async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    try {
        const commute = await Commute.findByIdAndDelete(req.params.id)
        if(!commute) {
            return res.status(404).json({message: 'Commute not found'})
        }
  
        await User.findByIdAndUpdate(req.user.id, {$pull: {commuteHistory: req.params.id}})

        res.status(200).json({message: 'Commute deleted successfully'})
    } catch (err) {
        console.error('Error deleting commute:', err.message);
        res.status(500).json({message: 'server error', err})
    }
});

module.exports = router;