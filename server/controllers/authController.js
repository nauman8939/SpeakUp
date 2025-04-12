const CryptoJS = require("crypto-js");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken'); // Add this line
const cookieParser = require('cookie-parser');
const loadTemplate = require("../utils/loadTemplate");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { payload } = req.body;

    const bytes = CryptoJS.AES.decrypt(payload, process.env.VITE_SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { name, email, password, avatar } = decryptedData;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, avatar });

    try {
      const emailHTML = loadTemplate("welcome.html", {
        name,
        link: process.env.CLIENT_URL,
      });

      await sendEmail(email, "🎉 Welcome to SpeakUp!", emailHTML);
      console.log("Welcome email sent successfully to:", email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
      // Don't fail the registration if email fails
    }

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

    // Try to set HTTP-only cookie
    try {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        domain: process.env.COOKIE_DOMAIN
      });
    } catch (cookieError) {
      console.log("Cookie setting failed, falling back to token response");
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token // Send token in response as fallback
    };

    res.json({ message: "Login successful", user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    // First try to get token from cookie
    let token = req.cookies.token;
    
    // If no cookie, try Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

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

const logout = async (req, res) => {
  try {
    // Try to clear cookie
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        domain: process.env.COOKIE_DOMAIN
      });
    } catch (cookieError) {
      console.log("Cookie clearing failed, continuing with logout");
    }

    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

const sendResetEmail = async (req, res) => {
  try {
    const { payload } = req.body;

    const bytes = CryptoJS.AES.decrypt(payload, process.env.VITE_SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { email } = decryptedData;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

    // Load HTML template with variables
    const emailHTML = loadTemplate("resetPassword.html", {
      name: user.name,
      resetLink,
    });

    await sendEmail(email, "🔐 Reset Your Password", emailHTML);

    res.json({ message: "Reset email sent successfully" });
  } catch (err) {
    console.error("Reset Email Error:", err.message);
    res.status(500).json({ message: "Failed to send reset email", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { payload } = req.body;
    const bytes = CryptoJS.AES.decrypt(payload, process.env.VITE_SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { token, password } = decryptedData;
    if (!token || !password) return res.status(400).json({ message: "Token and password are required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Invalidate token if password was changed after token was issued
    if (user.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(400).json({ message: "Token has expired due to password change" });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.passwordChangedAt = new Date(); 
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Invalid token or user not found" });

    // Check if password was changed after token was issued
    if (user.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(400).json({ message: "Token has expired due to password change" });
    }

    res.json({ valid: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
};

module.exports = {
  registerUser,
  login,
  getMe,
  logout,
  sendResetEmail,
  resetPassword,
  verifyResetToken
};

