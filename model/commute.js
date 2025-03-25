const mongoose = require('mongoose');

const commuteSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:  true},
    startLocation: {type: String, required: true},
    destination: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
    fareEstimation: { type: Number},
    timeStamp: { type: Date, default: Date.now},
});
module.exports = mongoose.model('Commute', commuteSchema)