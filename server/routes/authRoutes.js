const express = require('express');
const { registerUser , login,getMe,logout} = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);


module.exports = router;
