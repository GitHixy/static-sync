const express = require('express');
const axios = require('axios');
const { getFFLogsSdk } = require('../utils/authFFLogs');

const router = express.Router();

// Endpoint per ottenere i dati di un personaggio
router.get('/character/:name/:serverSlug/:serverRegion', async (req, res) => {
    try {
        const { name, serverSlug, serverRegion } = req.params;

        // Ottieni l'istanza SDK inizializzata con il token
        const ffSdk = await getFFLogsSdk();

        // Utilizza il metodo getCharacter dell'SDK per ottenere i dati del personaggio
        const response = await ffSdk.getCharacter({
            characterName: name,
            serverSlug: serverSlug,
            serverRegion: serverRegion,
            includeServer: true
        });

        // Rispondi con i dati del personaggio
        res.json(response.characterData.character);
    } catch (error) {
        console.error('Error fetching character data:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch character data' });
    }
});


module.exports = router;
