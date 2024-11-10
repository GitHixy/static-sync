const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint per ottenere i parse del personaggio
router.get('/character/:name/:server/:region', async (req, res) => {
    try {
        const { name, server, region } = req.params;
        
        const response = await axios.get(`https://www.fflogs.com/v1/parses/character/${name}/${server}/${region}`, {
            params: {
                api_key: process.env.FF_LOGS_API_KEY
            }
        });

        // Inverte l'ordine dei dati dei parses
        const reversedData = response.data.reverse();

        res.json(reversedData);
    } catch (error) {
        console.error('Error fetching character data:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch character data' });
    }
});

module.exports = router;
