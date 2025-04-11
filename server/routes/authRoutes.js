const express = require('express');
const { registerUser , login,getMe,logout,sendResetEmail,resetPassword,verifyResetToken} = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);
router.post('/forgot-password', sendResetEmail);
router.post('/reset-password', resetPassword);
router.get('/verify-reset-token', verifyResetToken);


module.exports = router;
