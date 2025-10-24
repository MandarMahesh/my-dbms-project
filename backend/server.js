const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();


const patientsRouter = require('./routes/patients');


const app = express();
app.use(cors());
app.use(express.json());


// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'public')));


// API
app.use('/api/patients', patientsRouter);


const PORT = process.env.PORT || 4000;


async function start() {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospitaldb';
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
}


start();