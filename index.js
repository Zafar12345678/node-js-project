const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors'); 
require('dotenv').config();
// const verifyToken = require("./middleware/auth");
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const storeRoutes = require('./routes/storeRoutes');
const storecategories = require('./routes/storecategoryRoutes');
const reviewRoutes = require('./routes/revieRoutes');


const app = express();

app.use(bodyParser.json());

// Use cors middleware to enable CORS
app.use(cors());

// Use authRoutes for both endpoints
app.use('/user', authRoutes);
app.use('/api/vender', categoryRoutes);
app.use('/api/store/providers', storeRoutes);
app.use('/api/store/providers/category', storecategories);
app.use('/api/vender/review', reviewRoutes);




const PORT = 8000;
const DB = "mongodb+srv://munna572000:Munna686622@salon.fboq520.mongodb.net/Booking?retryWrites=true&w=majority";

mongoose.connect(DB)
    .then(() => {
        console.log("Connected to MongoDB");
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log(`Server is running on :${PORT}`);
        });
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });
