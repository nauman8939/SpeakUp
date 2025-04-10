// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');



// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Use a proper regex pattern instead of '*'
app.options(/\/api\/.*/, cors(corsOptions)); // Handle all /api/ routes

// Middleware
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

module.exports = app;
