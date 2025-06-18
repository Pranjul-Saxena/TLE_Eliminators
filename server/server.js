const dotenv = require('dotenv');
// Load env vars
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const helmet = require('helmet'); // Security headers
const morgan = require('morgan'); // Request logging
// const errorHandler = require('./middleware/errorHandler');
require('./cron'); // Load cron jobs


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging

app.use(express.json());
app.use(cors());


// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});
// Routes
app.use('/api/v1/students', studentRoutes);

// Error handling middleware
// app.use(errorHandler);

// Start server
const startServer = async () => {
    await connectDB(); // Connect to DB
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();