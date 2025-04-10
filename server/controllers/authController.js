const CryptoJS = require("crypto-js");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

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

module.exports = { registerUser };
