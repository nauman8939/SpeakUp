// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');

// Initialize the app before using any middleware
const app = express();

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Use cookie-parser middleware after initializing the app
app.use(cookieParser());

// Use CORS middleware
app.use(cors(corsOptions));

// Use JSON parser middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

module.exports = app;
