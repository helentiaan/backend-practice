const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// connect to db
try {
    mongoose.connect(
        process.env.DB_CONNECT,
        { useNewUrlParser: true,
        useUnifiedTopology: true},
        ()=>{console.log('Connected to Mongo DB.');});
    
} catch (error) {
    console.log(error);
}


// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () =>{console.log("The server is up and running.");});