const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            // console.log(mongoURI)
            console.error("MongoDB URI is missing in environment variables.");
            process.exit(1);
        }
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    }catch(error) {
        console.error('MongoDb connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDb;
