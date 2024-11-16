const express = require('express');
const Static = require('../models/Static');
const User = require('../models/User');
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

        const user = await User.findById(req.user._id);
        user.statics.push({ staticId: savedStatic._id, name: savedStatic.name });
        await user.save();

        res.json(savedStatic);
    } catch (error) {
        console.error('Error creating static:', error);
        res.status(500).json({ message: 'Error creating static' });
    }
});

// Endpoint per aggiungere un membro allo statico
router.post('/:id/members', protect, async (req, res) => {
    const { playerId, name, lodestoneID, role, playerClass, data } = req.body; 
    
    try {
        
        const userStatic = await Static.findOne({ _id: req.params.id, owner: req.user._id });

        if (!userStatic) {
            return res.status(404).json({ message: 'Static not found' });
        }

        if (userStatic.members.length >= 8) {
            return res.status(400).json({ message: 'Static team is already full.' });
        }

        
        const existingMember = userStatic.members.find(
            (member) => member.playerId === characterData.characterInfo.id
        );
        if (existingMember) {
            return res.status(400).json({ message: 'Player is already in the static.' });
        }

        
        const newMember = {
            playerId: playerId,
            name: name,
            lodestoneID: lodestoneID,
            role: role,
            class: playerClass,
            data: data, 
        };

        userStatic.members.push(newMember);
        await userStatic.save();

        res.json(userStatic);
    } catch (error) {
        console.error('Error adding member to static:', error.message);
        res.status(500).json({ message: 'Error adding member to static' });
    }
});


// Endpoint per ottenere tutti gli statici di un utente
router.get('/', protect, async (req, res) => {
    try {
        const user = await Static.find({ owner: req.user._id });
        res.json(user);
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
