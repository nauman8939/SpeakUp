const CryptoJS = require("crypto-js");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken'); // Add this line
const cookieParser = require('cookie-parser');

const registerUser = async (req, res) => {
  try {
    const { payload } = req.body;

    // Decrypt the payload
    const bytes = CryptoJS.AES.decrypt(payload, process.env.VITE_SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { name, email, password, avatar } = decryptedData;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, avatar });

    const emailHTML = `
      <h2>Welcome to SpeakUp, ${name} 👋</h2>
      <p>We're thrilled to have you on board. Let's build something amazing together 🚀</p>
    `;

    await sendEmail(email, "Welcome to SpeakUp!", emailHTML);

    res.status(201).json({ msg: 'User registered successfully', user });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { payload } = req.body;
    const bytes = CryptoJS.AES.decrypt(payload, process.env.VITE_SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { email, password } = decryptedData;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    res.json({ message: "Login successful", user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const getMe = async (req, res) => {
  try {

    const token = req.cookies.token;  
    if (!token) return res.status(401).json({ message: "Not logged in" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Error:", err.message); 
    res.status(401).json({ message: "Invalid session", error: err.message });
  }
};

// In your authController.js
const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

module.exports = { login, registerUser, getMe, logout };

