// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const blogsRoutes = require('./routes/blogRoutes');

// Initialize the app
const app = express();

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const CLIENT_URL = process.env.CLIENT_URL;

console.log("CLIENT_URL",CLIENT_URL);

// CORS configuration
const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogsRoutes);

module.exports = app;
