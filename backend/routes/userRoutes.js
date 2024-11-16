const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

const router = express.Router();

// Endpoint per creare uno User
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            isAdmin: false,
        });

        await user.save();


        const accessToken = generateAccessToken(user._id, user.isAdmin);
        const refreshToken = generateRefreshToken(user._id);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            accessToken, 
            refreshToken, 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Endpoint per il login dello User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Trova l'utente
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Verifica la password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Genera i token
        const accessToken = generateAccessToken(user._id, user.isAdmin);
        const refreshToken = generateRefreshToken(user._id);

        // Restituisci i dati dell'utente e i token
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            accessToken, // Token per le richieste API
            refreshToken, // Token per il refresh
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;
