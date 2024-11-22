const express = require('express');
const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { generateRefreshToken, generateAccessToken } = require('../utils/generateToken');

const generateCodeChallenge = (codeVerifier) => {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64');
    return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

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


router.get('/discord', (req, res, next) => {
    const platform = req.query.platform || 'web';

    // Generate PKCE code verifier and challenge
    const codeVerifier = crypto.randomBytes(32).toString('hex');
    const codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');

    const state = Buffer.from(JSON.stringify({ platform, codeChallenge })).toString('base64');
    req.session.codeVerifier = codeVerifier; // Save codeVerifier in session for validation

    passport.authenticate('discord', { state })(req, res, next);
});


router.get('/discord/callback', (req, res, next) => {
    const state = req.query.state
        ? JSON.parse(Buffer.from(req.query.state, 'base64').toString('utf-8'))
        : {};

    console.log("Decoded state:", state);

    const isMobile = state.platform === 'mobile';
    const { codeVerifier } = req.session;

    passport.authenticate('discord', async (err, user) => {
        if (err || !user) {
            return res.redirect(`${process.env.BASE_REDIRECT_URL}?error=auth_failed`);
        }

        const accessToken = generateAccessToken(user._id, user.isAdmin);
        const refreshToken = generateRefreshToken(user._id);

        const redirectUrl = isMobile
            ? `myapp:///success?auth=${accessToken}&refreshToken=${refreshToken}&id=${user._id}&username=${user.username}&discordId=${user.discord.id}`
            : `${process.env.BASE_REDIRECT_URL}/success?auth=${accessToken}&refreshToken=${refreshToken}&id=${user._id}&username=${user.username}&discordId=${user.discord.id}`;

        console.log("Redirecting to:", redirectUrl);
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



