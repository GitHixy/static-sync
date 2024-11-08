const express = require('express');
const Static = require('../models/Static');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Crea un nuovo statico
router.post('/', protect, async (req, res) => {
    const { name, description } = req.body;

    try {
        const newStatic = new Static({
            owner: req.user._id,
            name,
            description,
            members: [],
            isComplete: false
        });

        const savedStatic = await newStatic.save();
        res.json(savedStatic);
    } catch (error) {
        res.status(500).json({ message: 'Error creating static' });
    }
});

// Endpoint per aggiungere un membro allo statico
router.post('/:id/members', protect, async (req, res) => {
    const { playerId, name, role, class: playerClass } = req.body;

    try {
        // Trova lo statico specifico e verifica che l'utente sia il proprietario
        const userStatic = await Static.findOne({ _id: req.params.id, owner: req.user._id });

        if (!userStatic) {
            return res.status(404).json({ message: 'Static not found' });
        }

        // Verifica che lo statico non abbia già 8 membri
        if (userStatic.members.length >= 8) {
            return res.status(400).json({ message: 'Static team is already full.' });
        }

        // Aggiungi il membro
        const newMember = {
            playerId,
            name,
            role,
            class: playerClass,
            isConfirmed: false
        };

        userStatic.members.push(newMember);
        await userStatic.save();

        res.json(userStatic);
    } catch (error) {
        res.status(500).json({ message: 'Error adding member to static' });
    }
});

// Endpoint per ottenere tutti gli statici di un utente
router.get('/', protect, async (req, res) => {
    try {
        const userStatics = await Static.find({ owner: req.user._id });
        res.json(userStatics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statics' });
    }
});

// Endpoint per confermare lo statico
router.post('/:id/confirm', protect, async (req, res) => {
    try {
        const userStatic = await Static.findOne({ _id: req.params.id, owner: req.user._id });

        if (!userStatic) {
            return res.status(404).json({ message: 'Static not found' });
        }

        if (userStatic.validateComposition()) {
            userStatic.isComplete = true;
            await userStatic.save();
            res.json({ message: 'Static is complete and confirmed!' });
        } else {
            res.status(400).json({ message: 'The static does not have the correct composition of roles.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error confirming the static' });
    }
});

module.exports = router;
