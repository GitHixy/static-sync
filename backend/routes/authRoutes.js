const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { generateRefreshToken, generateAccessToken } = require('../utils/generateToken');

router.post('/refresh', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }
    console.log('Refresh endpoint hit');
    console.log('Received token:', req.body.token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Trova l'utente nel database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Genera un nuovo access token
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});


router.get('/discord', passport.authenticate('discord'));


router.get('/discord/callback', (req, res, next) => {
    passport.authenticate('discord', async (err, user) => {
        if (err || !user) {
            return res.redirect(`${process.env.BASE_REDIRECT_URL}?error=auth_failed`);
        }

        
        const accessToken = generateAccessToken(user._id, user.isAdmin);
        const refreshToken = generateRefreshToken(user._id);

        const redirectUrl = req.headers["user-agent"].includes("Expo") || req.query.platform === "mobile"
            ? `myapp://success?auth=${accessToken}&refreshToken=${refreshToken}&id=${user._id}&username=${user.username}&discordId=${user.discord.id}`
            : `${process.env.BASE_REDIRECT_URL}/success?auth=${accessToken}&refreshToken=${refreshToken}&id=${user._id}&username=${user.username}&discordId=${user.discord.id}`;

        return res.redirect(redirectUrl);
    })(req, res, next);
});


router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(req.user);
});

module.exports = router;



