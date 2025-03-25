const mongoose = require('mongoose')

const routePreferenceSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    preferredRoutes: [{
        startLocation: String,
        destination: String,
        preferredMode: String,
        savedAt: {type: Date, default: Date.now}
    }]
});

module.exports = mongoose.model('RoutePreferrence', routePreferenceSchema)