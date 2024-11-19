const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

        
        const token = jwt.sign(
            { userId: user._id, discordId: user.discord.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        
        return res.redirect(
            `${process.env.BASE_REDIRECT_URL}/success?auth=${token}&id=${user._id}&username=${user.username}&discordId=${user.discord.id}`
        );
    })(req, res, next);
});


router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(req.user);
});

module.exports = router;

module.exports = router;

